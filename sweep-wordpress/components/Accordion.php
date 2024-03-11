<?php
/** @noinspection PhpUnused */

enum ACCORDION_ELEMENT: string
{
	/**
	 * Main container for all accordion row
	 */
	case CONTAINER = 'container';
	/**
	 * Single accordion row element
	 */
	case ROW = 'row';
	/**
	 * Container for trigger button
	 */
	case HEADER = 'header';
	/**
	 * Single trigger button element
	 */
	case TRIGGER = 'trigger';
	/**
	 * Outer content element
	 */
	case CONTENT = 'content';
	/**
	 * Inner content wrapper to prevent collapsing glitches
	 */
	case CONTENT_INNER = 'content-inner';
}

class Accordion extends TriggerForContentComponent
{

	private bool $open_first_row = false;

	public function __construct( array $rows ) {
		parent::__construct( $rows );
	}

	/**
	 * Is _open first row at start_ option enabled
	 */
	public function is_open_first(): bool {
		return $this->open_first_row;
	}

	/**
	 * Enable _open first row at start_ option
	 */
	public function open_first(): self {
		$this->open_first_row = true;

		return $this;
	}

	/**
	 * `$child` will be rendered as content of each button in row header
	 *
	 * **MAKE SURE** you are following W3 documentation by using inline elements inside
	 * @param callable|string $child
	 * @return Accordion
	 */
	public function set_row_trigger( callable|string $child ): self {
		$this->set_trigger_child( $child );

		return $this;
	}

	/**
	 * `$child` will be rendered as content of each tab
	 * @param callable|string $child
	 * @return Accordion
	 */
	public function set_row_content( callable|string $child ): self {
		$this->set_content_child( $child );

		return $this;
	}

	/**
	 * @see parent::set_element_attributes()
	 */
	public function set_attributes(
		ACCORDION_ELEMENT $element,
		callable|array    $attrs
	): Accordion {
		return $this->set_element_attributes( $element->value, $attrs );
	}


	public function render(): void {
		?>
		<?php if ( $this->items ): ?>
			<div <?= $this->handle_attributes( ACCORDION_ELEMENT::CONTAINER->value, [
				"class" => "accordion-component",
				"id"    => "accordion-$this->component_id",
			] ) ?>>
				<?php foreach ( $this->items as $row_index => $row ): ?>
					<?php
					$row_id = "$this->component_id-$row_index";
					?>
					<div <?= $this->handle_attributes( ACCORDION_ELEMENT::ROW->value, [
						"class" => "accordion-row",
					] ) ?>>
						<div <?= $this->handle_attributes( ACCORDION_ELEMENT::HEADER->value, [
							"class" => "accordion-header",
						] ) ?>>
							<button
								<?= $this->handle_attributes( ACCORDION_ELEMENT::TRIGGER->value, [
									'type'          => 'button',
									"id"            => "accordion-trigger-$row_id",
									"data-toggle"   => "collapse",
									"data-target"   => "#accordion-content-$row_id",
									// TODO: make first open optional from $props
									"aria-expanded" => $row_index === 0 && $this->open_first_row ? 'true' : 'false',
									"aria-controls" => "accordion-content-$row_id",
									"class"         => [
										'accordion-trigger',
										'collapsed' => $row_index !== 0 && $this->open_first_row,
									],
								], $row_index ) ?>
							><?php $this->render_child( $this->trigger_child, $row, $row_index ); ?></button>
						</div>
						<div
							<?= $this->handle_attributes( ACCORDION_ELEMENT::CONTENT->value, [
								"id"              => "accordion-content-$row_id",
								"aria-labelledby" => "accordion-trigger-$row_id",
								"data-parent"     => "#accordion-$this->component_id",
								"class"           => [
									'accordion-content',
									'collapse',
									'show' => $row_index === 0 && $this->open_first_row,
								],
							], $row_index ) ?>
						>
							<div <?= $this->handle_attributes( ACCORDION_ELEMENT::CONTENT_INNER->value, [
								"class" => "accordion-content-inner",
							] ) ?>><?php $this->render_child( $this->content_child, $row, $row_index ); ?></div>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		<?php
	}
}
