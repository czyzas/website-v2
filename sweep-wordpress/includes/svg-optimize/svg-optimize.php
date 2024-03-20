<?php

class FH_SVG
{
	protected int $file_id;
	protected string $post_meta_name = 'fh_svg_source_code';

	/**
	 * @throws Exception if not svg or not found file
	 */
	public function __construct( $id ) {
		$this->file_id = $id;
		$file_raw = get_attached_file( $this->file_id );

		if ( !$file_raw || !file_exists( $file_raw ) || mime_content_type( $file_raw ) !== 'image/svg+xml' ) {
			throw new Exception( 'The file was not found or has the wrong extension' );
		}
	}

	/**
	 * @throws Exception if optimised source empty
	 */
	public function get_source_code( $attrs = [] ): ?string {
		$source = get_post_meta( $this->file_id, $this->post_meta_name, true );
		if ( empty( $source ) ) {
			throw new Exception( 'Source is empty' );
		}

		if ( !empty( $attrs ) ) {
			$svg = new SimpleXMLElement( $source );
			foreach ( $attrs as $attr => $value ) {
				$svg->addAttribute( $attr, $value );
			}

			return $svg->asXML();
		}

		return $source;
	}

	public function set_source_code( $source ): bool {
		return (bool)update_post_meta( $this->file_id, $this->post_meta_name, $source );
	}
}

add_action( 'admin_print_footer_scripts', function () {
	?>
	<script type="module">
		import svgo from 'https://cdn.jsdelivr.net/npm/svgo@3.0.2/dist/svgo.browser.min.js';

		(function ($) {
			const nonce = '<?php echo wp_create_nonce( 'wp_rest' ); ?>';

			function optimize_svg(src) {
				const svgo_settings = {
					multipass: true,
					plugins: [
						{
							name: 'preset-default',
							params: {
								overrides: {
									removeDimensions: false,
									removeViewBox: false,
									cleanupIds: false,
								},
							},
						},
						'convertStyleToAttrs',
						'removeScriptElement',
					],
				};

				return svgo.optimize(src, svgo_settings);
			}

			async function update_svg_postmeta(id, src) {
				const response = await fetch('/wp-json/wp-bootstrap-gulp/v1/update-svg-postmeta', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
						'X-WP-Nonce': nonce,
					},
					body: JSON.stringify({
						attachment_id: id,
						source: src,
					}),
				});

				const json = await response.json();
				if (!response.ok || !json.success) {
					throw new Error(json.data?.error || `${response.status} ${response.statusText}`);
				}

				return true;
			}

			$(document).on('click', 'button[data-action="fh-optimize-svg"]', async function () {
				const id = +this.dataset.id;
				const url = this.dataset.url;

				try {
					this.disabled = true;
					this.innerText = 'Optimizing...';
					const src = await fetch(url).then(res => res.text());
					const dist = optimize_svg(src);

					await update_svg_postmeta(id, dist.data);

					this.innerText = 'Optimized';
					console.log('SVG optimised successfully!');
				} catch (error) {
					this.innerText = 'Error';
					console.error('SVG can\'t be optimised', { error });
				} finally {
					this.disabled = false;
					setTimeout(() => {
						this.innerText = 'Optimize SVG';
					}, 3000);
				}
			});

			if (typeof wp.Uploader === 'function') {
				$.extend(wp.Uploader.prototype, {
					success: async function (file_attachment) {
						const { id } = file_attachment;
						const {
							subtype,
							url,
						} = file_attachment.attributes;
						if (subtype === 'svg+xml') {
							try {
								const src = await fetch(url).then(res => res.text());
								const dist = optimize_svg(src);

								await update_svg_postmeta(id, dist.data);


								console.log('SVG optimised successfully!');
							} catch (error) {
								console.error('SVG can\'t be optimised', {
									file_attachment,
									error,
								});
							}
						}
					},
				});
			}
		})(jQuery);
	</script>
	<?php
}, 100 );

add_action( 'graphql_register_types', function () {
	try {
		register_graphql_fields( 'MediaItem', [
			'svgSourceCode' => [
				'type'        => 'String',
				'description' => 'Return svg source if image was optimized inside WP',
				'resolve'     => function ( \WPGraphQL\Model\Post $page ) {
					try {
						$file = new FH_SVG( $page->databaseId );

						return $file->get_source_code();
					} catch ( Exception ) {
						return null;
					}
				}
			],
		] );
	} catch ( Exception ) {
	}
} );

// Add hidden inputs and optimize button
add_filter( 'attachment_fields_to_edit', function ( $form_fields, $post ) {

	if ( $post->post_mime_type === 'image/svg+xml' ) {
		$attrs = convert_attributes_to_string( [
			'class'       => 'button-secondary button-large',
			'data-url'    => wp_get_attachment_url( $post->ID ),
			'data-id'     => $post->ID,
			'data-action' => 'fh-optimize-svg'
		] );

		$form_fields['fh-regenerate-svg-button'] = array(
			'input'         => 'html',
			'html'          => "<button $attrs>Optimize SVG</button>",
			'show_in_modal' => true,
			'show_in_edit'  => true,
		);
	}

	return $form_fields;
}, 99, 2 );

add_action( 'rest_api_init', function () {
	register_rest_route( 'wp-bootstrap-gulp/v1', '/update-svg-postmeta', array(
		'methods'             => 'PUT',
		'permission_callback' => function ( WP_REST_Request $request ) {
			return current_user_can( 'edit_posts' );
		},
		'callback'            => function ( WP_REST_Request $request ) {
			$result = false;

			try {
				if ( empty( $request->get_param( 'source' ) ) ) {
					throw new Exception( 'Source is empty' );
				}
				$file = new FH_SVG( $request->get_param( 'attachment_id' ) );
				$file->set_source_code( $request->get_param( 'source' ) );
				$result = true;
				$message = 'Source updated';
			} catch ( Exception $e ) {
				$message = $e->getMessage();
			}

			return new WP_REST_Response( [
				'success' => $result,
				'data'    => $message
			], $result ? 200 : 404 );
		},
	) );
} );
