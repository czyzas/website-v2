<?php
/** @noinspection PhpUnused */

abstract class TriggerForContentComponent
{
	protected array $items = [];
	/**
	 * Name is a slugified string used to determine id of component
	 * @var string
	 */
	protected string $name = '';
	protected string $component_id;
	/** @var callable */
	protected $trigger_child = '';
	/** @var callable */
	protected $content_child = '';
	protected array $attributes = [];

	public function __construct( array $items ) {
		$this->items = $items ?: [];

		$this->component_id = uniqid();
	}

	public function get_name(): string {
		return $this->name;
	}

	public function get_id(): string {
		return $this->component_id;
	}

	public function set_name( string $name ): self {
		$this->name = sanitize_title( $name );
		$this->component_id = uniqid( "$this->name-" );

		return $this;
	}

	/**
	 * Set element to be rendered inside each trigger child
	 */
	protected function set_trigger_child( callable|string $child ): self {
		$this->trigger_child = $child;

		return $this;
	}

	/**
	 * Set element to be rendered inside each content child
	 */
	protected function set_content_child( callable|string $child ): self {
		$this->content_child = $child;

		return $this;
	}

	/**
	 * Set attributes to specific element
	 */
	protected function set_element_attributes( string $key, callable|array $attrs ): self {
		// Assume that `trigger` and `content` keys can appear more then once
		if ( $key === 'trigger' || $key === 'content' ) {
			foreach ( $this->items as $index => $item ) {
				$this->attributes[$key][$index] = is_callable( $attrs ) ? $attrs( $item, $index ) : $attrs;
			}
		} else {
			$this->attributes[$key] = is_callable( $attrs ) ? $attrs( $this->items ) : $attrs;
		}


		return $this;
	}

	/**
	 * Internal function to determine child type before render
	 */
	protected function render_child( callable|string $child, ...$args ): void {
		if ( !$child ) return;

		echo is_callable( $child ) ? $child( ...$args ) : $child;
	}

	/**
	 * Internal function to specify place and default attributes for elements
	 */
	protected function handle_attributes(
		string $key,
		array  $default_attrs,
		?int   $index = null,
	): string {
		$parse_class = static fn( $cls ) => $cls ? (array)$cls : [];

		// `trigger` and `content` keys can appear more than once
		// and the index must be used additionally
		$user_attrs = ( $index ?? null ) !== null ? ( $this->attributes[$key][$index] ?? [] ) : ( $this->attributes[$key] ?? [] );

		$attrs = wp_parse_args( $user_attrs, $default_attrs );
		$default_class = $parse_class( $default_attrs['class'] ?? null );
		$user_class = $parse_class( $user_attrs['class'] ?? null );
		$merged_class = classNames( $default_class, $user_class );
		$attrs['class'] = $merged_class;

		return convert_attributes_to_string( $attrs );
	}

	public abstract function render(): void;
}