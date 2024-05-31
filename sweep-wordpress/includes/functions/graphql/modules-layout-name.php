<?php
add_action( 'graphql_register_types', function () {
	try {
		$MODULES_GROUP_ID = 1918;
		$group = acf_get_field_group( $MODULES_GROUP_ID );
		$group_fields = acf_get_fields( $MODULES_GROUP_ID );
		$modules_content_field = $group_fields[0];
		$layouts = $modules_content_field['layouts'];
		foreach ( $layouts as $layout ) {
			$type_name = graphql_format_type_name(
				implode(
					' ',
					[
						$group['graphql_field_name'],
						$modules_content_field['name'],
						$layout['name'],
						'Layout',
					]
				)
			);

			register_graphql_field( $type_name, 'layoutName', [
				'type'        => 'String',
				'description' => 'Get flexible field layout name',
				'resolve'     => function ( $page ) {
					return $page['acf_fc_layout'];
				}
			] );
		}
	} catch ( Exception $e ) {
	}
} );
