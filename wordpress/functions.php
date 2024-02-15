<?php

    // Config
    require_once "includes/functions/utils-functions.php";
    require_once "includes/functions/config.php";
    require_once "includes/functions/acf.php";
    require_once "includes/functions/language.php";
    require_once "includes/functions/images.php";
    require_once "includes/functions/theme-specific.php";
    require_once "includes/functions/editor-formats.php";
    require_once "includes/functions/register-menus.php";
    require_once "includes/functions/tracking-codes.php";
	require_once "includes/svg-optimize/svg-optimize.php";

    // Includes
    require_once "includes/functions/enqueue-assets.php";
    require_once "includes/numbers-converter/numbers-converter-admin.php";
    require_once "includes/translations/translations.php";
	require_once "includes/functions/register-dashboard-widget.php";

	// Components
	require_once "components/Quotation.php";
	require_once "components/Number.php";
	require_once "components/TriggerForContentComponent.php";
	require_once "components/Tabs.php";
	require_once "components/Accordion.php";

    //NAVWALKER MENU
    require_once get_template_directory() . '/class-wp-bootstrap-navwalker.php';
