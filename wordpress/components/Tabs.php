<?php
/** @noinspection PhpUnused */

enum TABS_ELEMENT: string
{
	/**
	 * Main container for tabs component
	 */
	case CONTAINER = 'container';
	/**
	 * `<nav>` element for accessibility purposes
	 */
	case NAV_CONTAINER = 'nav-container';
	/**
	 * Container for all tabs navigation buttons
	 */
	case TAB_NAV = 'tab-nav';
	/**
	 * Single navigation button element
	 */
	case TAB_NAV_ITEM = 'trigger';
	/**
	 * Container for all content elements
	 */
	case CONTENT_CONTAINER = 'content-container';
	/**
	 * Single content element
	 */
	case TAB_PANE = 'content';
	/**
	 * Inner content wrapper
	 */
	case CONTENT_INNER = 'content-inner';
}

class Tabs extends TriggerForContentComponent
{

	/**
	 * `$child` will be rendered as content of each buttons in nav
	 *
	 * **MAKE SURE** you are following W3 documentation by using inline elements inside
	 * @param callable|string $child
	 * @return $this
	 */
	public function set_tab_nav_item( callable|string $child ): self {
		$this->set_trigger_child( $child );

		return $this;
	}

	/**
	 * `$child` will be rendered as content of each tab
	 * @param callable|string $child
	 * @return $this
	 */
	public function set_tab_content( callable|string $child ): self {
		$this->set_content_child( $child );

		return $this;
	}

	/**
	 * @see parent::set_element_attributes()
	 */
	public function set_attributes(
		TABS_ELEMENT   $element,
		callable|array $attrs
	): Tabs {
		return $this->set_element_attributes( $element->value, $attrs );
	}

	public function render_nav(): void {
		?>
		<nav <?= $this->handle_attributes( TABS_ELEMENT::NAV_CONTAINER->value, [] ) ?>>
			<div <?= $this->handle_attributes( TABS_ELEMENT::TAB_NAV->value, [
				'class' => 'nav tab-nav',
				'role'  => 'tablist'
			] ); ?>>
				<?php foreach ( $this->items as $tab_index => $tab ): ?>
					<?php $single_tab_id = "$this->component_id-$tab_index"; ?>
					<button
						<?= $this->handle_attributes( TABS_ELEMENT::TAB_NAV_ITEM->value, [
							'type'          => 'button',
							'role'          => 'tab',
							'data-toggle'   => 'pill',
							'id'            => "tab-nav-$single_tab_id",
							'data-target'   => "#tab-content-$single_tab_id",
							'aria-controls' => "tab-content-$single_tab_id",
							'aria-selected' => $tab_index === 0 ? 'true' : 'false',
							'class'         => [
								'tab-nav-item',
								'active' => $tab_index === 0,
							],
						], $tab_index ) ?>
					><?php $this->render_child( $this->trigger_child, $tab, $tab_index ); ?></button>
				<?php endforeach; ?>
			</div>
		</nav>
		<?php
	}

	public function render_content(): void {
		?>
		<div <?= $this->handle_attributes( TABS_ELEMENT::CONTENT_CONTAINER->value, [ 'class' => 'tab-content' ] ) ?>>
			<?php foreach ( $this->items as $tab_index => $tab ): ?>
				<?php $single_tab_id = "$this->component_id-$tab_index"; ?>
				<div <?= $this->handle_attributes( TABS_ELEMENT::TAB_PANE->value, [
					'role'            => 'tabpanel',
					"id"              => "tab-content-$single_tab_id",
					"aria-labelledby" => "tab-nav-$single_tab_id",
					"class"           => [
						'tab-pane fade',
						'show active' => $tab_index === 0
					],
				], $tab_index ) ?>
				>
					<div <?= $this->handle_attributes( TABS_ELEMENT::CONTENT_INNER->value, [
						"class" => 'tab-content-inner',
					] ) ?>><?php $this->render_child( $this->content_child, $tab, $tab_index ); ?></div>
				</div>
			<?php endforeach; ?>
		</div>
		<?php
	}

	public function render(): void {
		?>
		<?php if ( $this->items ): ?>
			<div <?= $this->handle_attributes( TABS_ELEMENT::CONTAINER->value, [ 'class' => 'tabs-component' ] ) ?>>
				<?php $this->render_nav() ?>
				<?php $this->render_content() ?>
			</div>
		<?php endif; ?>
		<?php
	}
}