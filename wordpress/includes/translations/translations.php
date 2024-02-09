<?php

function getAllTranslations( $language = null ): array {
	$translations = [
		"usun"                          => [
			"en" => "Delete",
			"pl" => "Usuń"
		],
		"usun_notatke"                  => [
			"en" => "Delete note",
			"pl" => "Usuń notatkę"
		],
		"zapisz"                        => [
			"en" => "Save",
			"pl" => "Zapisz"
		],
		"zamknij"                       => [
			"en" => "Close",
			"pl" => "Zamknij"
		],
		"brak_notatek"                  => [
			"en" => "No notes",
			"pl" => "Brak notatek"
		],
		"nowa_notatka"                  => [
			"en" => "New note",
			"pl" => "Nowa notatka"
		],
		"wpisz_notatke"                 => [
			"en" => "Write the note",
			"pl" => "Wpisz notatkę"
		],
		"dodaj_notatke"                 => [
			"en" => "Add note",
			"pl" => "Dodaj notatkę"
		],
		"zobacz_notatki"                => [
			"en" => "See notes",
			"pl" => "Zobacz notatki"
		],
		"notatka_nie_moze_byc_pusta"    => [
			"en" => "Note can't be saved",
			"pl" => "Notatka nie może być pusta"
		],
		"notatka_zostala_zapisana"      => [
			"en" => "Note has been saved",
			"pl" => "Notatka została zapisana"
		],
		"koszyk_jest_pusty"             => [
			"en" => "Basket is empty",
			"pl" => "Koszyk jest pusty"
		],
		"wyslij_do_drukarki"            => [
			"en" => "Send to printer",
			"pl" => "Wyślij do drukarki"
		],
		"zamknij_wersje_do_druku"       => [
			"en" => "Close print version",
			"pl" => "Zamknij wersję do druku"
		],
		"podkresl_tekst"                => [
			"en" => "Highlight text",
			"pl" => "Podkreśl tekst"
		],
		"wersja_do_druku"               => [
			"en" => "Print version",
			"pl" => "Wersja do druku"
		],
		"dodaj_do_koszyka_z_wydrukami"  => [
			"en" => "Add to print basket",
			"pl" => "Dodaj do koszyka z wydrukami"
		],
		"usun_z_koszyka_wydrukow"       => [
			"en" => "Remove from print basket",
			"pl" => "Usuń z koszyka wydruków"
		],
		"idz_do_koszyka_z_wydrukami"    => [
			"en" => "Go to print basket",
			"pl" => "Idź do koszyka z wydrukami"
		],
		"wyniki_wyszukiwania"           => [
			"en" => "Search results",
			"pl" => "Wyniki wyszukiwania"
		],
		"poprzednia_strona"             => [
			"en" => "Previous page",
			"pl" => "Poprzednia strona"
		],
		"nastepna_strona"               => [
			"en" => "Next page",
			"pl" => "Następna strona"
		],
		"zobacz_wiecej"                 => [
			"en" => "See more",
			"pl" => "Zobacz więcej"
		],
		"strona"                        => [
			"en" => "Page",
			"pl" => "Strona"
		],
		"zwin"                          => [
			"en" => "Less",
			"pl" => "Zwiń"
		],
		"rozwin"                        => [
			"en" => "More",
			"pl" => "Rozwiń"
		],
		"narzedzia"                     => [
			"en" => "Tools",
			"pl" => "Narzędzia"
		],
		"eksport_do_excela"             => [
			"en" => "Export to Excel",
			"pl" => "Eksportuj do Excela"
		],
		"powieksz"                      => [
			"en" => "Enlarge",
			"pl" => "Powiększ"
		],
		"kontrast"                      => [
			"en" => "Contrast",
			"pl" => "Kontrast"
		],
		"rozmiar_tekstu"                => [
			"en" => "Font size",
			"pl" => "Rozmiar tekstu"
		],
		"mala"                          => [
			"en" => "small",
			"pl" => "mała"
		],
		"normalna"                      => [
			"en" => "normal",
			"pl" => "normalna"
		],
		"duza"                          => [
			"en" => "large",
			"pl" => "duża"
		],
		"jezyk"                         => [
			"en" => "Language",
			"pl" => "Język"
		],
		"jezyk_polski"                  => [
			"en" => "Polish language",
			"pl" => "Język polski"
		],
		"jezyk_angielski"               => [
			"en" => "English language",
			"pl" => "Język angielski"
		],
		"przelacz_menu"                 => [
			"en" => "Toggle menu",
			"pl" => "Przełącz menu"
		],
		"strona_nie_zostala_znaleziona" => [
			"en" => "Page not found",
			"pl" => "Strona nie została znaleziona"
		],
		"wyniki_wyszukiwania_dla"       => [
			"en" => "You searched for",
			"pl" => "Wyniki wyszukiwania dla"
		],
		"szukaj"                        => [
			"en" => "Search",
			"pl" => "Szukaj"
		],
		"pokaz_wyniki_wyszukiwania"     => [
			"en" => "Show search results",
			"pl" => "Pokaż wyniki wyszukiwania"
		],
		"wpisz_wyszukiwane_haslo"       => [
			"en" => "Enter your search term",
			"pl" => "Wpisz wyszukiwane hasło"
		],
		"udostepnij"                    => [
			"en" => "Share",
			"pl" => "Udostępnij"
		],
		"udostepnij_w"                  => [
			"en" => "Share on",
			"pl" => "Udostępnij w"
		],
		"poprzednie_raporty"            => [
			"en" => "Previous reports",
			"pl" => "Poprzednie raporty"
		],
		"zakres_dat"                    => [
			"en" => "Date range:",
			"pl" => "Zakres dat:"
		],
		"slowo_kluczowe"                => [
			"en" => "Keyword",
			"pl" => "Słowo kluczowe"
		],
		"data_godzina"                  => [
			"en" => "Date/hour",
			"pl" => "Data/godzina"
		],
		"numer"                         => [
			"en" => "Number",
			"pl" => "Numer"
		],
		"tytul"                         => [
			"en" => "Title",
			"pl" => "Tytuł"
		],
		"rodzaj"                        => [
			"en" => "Type",
			"pl" => "Rodzaj"
		],
		"data"                          => [
			"en" => "Date",
			"pl" => "Data"
		],
		"godzina"                       => [
			"en" => "Hour",
			"pl" => "Godzina"
		],
		"lokalizacja"                   => [
			"en" => "Location",
			"pl" => "Lokalizacja"
		],
		"pliki_do_pobrania"             => [
			"en" => "Files to download",
			"pl" => "Pliki do pobrania"
		],
		"pliki_do_pobrania_brak"        => [
			"en" => "No files to download",
			"pl" => ": brak plików do pobrania"
		],
		"zapisz_w_outlook"              => [
			"en" => "Save to Outlook",
			"pl" => "Zapisz w Outlook"
		],
		"raporty"                       => [
			"en" => "Reports",
			"pl" => "Raporty"
		],
		"walne_zgromadzenia"            => [
			"en" => "General meetings",
			"pl" => "Walne zgromadzenia"
		],
		"kalendarz"                     => [
			"en" => "Calendar",
			"pl" => "Kalendarz"
		],
		"odrzuc_wszystkie"              => [
			"en" => "Reject all cookies",
			"pl" => "Odrzuć wszystkie"
		],
		"zapisz_wybor"                  => [
			"en" => "Save and close",
			"pl" => "Zapisz i zamknij"
		],
		"zaakceptuj_wszystkie"          => [
			"en" => "Accept all cookies",
			"pl" => "Zaakceptuj wszystkie"
		],
		"ustawienia_cookies"            => [
			"en" => "Cookies settings",
			"pl" => "Ustawienia cookies"
		],
		"cookies_niezbedne"             => [
			"en" => "Cookies required",
			"pl" => "Cookies niezbędne"
		],
		"cookies_funkcjonalne"          => [
			"en" => "Cookies functional",
			"pl" => "Cookies funkcjonalne"
		],
		"cookies_analityczne"           => [
			"en" => "Cookies analytical",
			"pl" => "Cookies analityczne"
		],
		"cookies_marketingowe"          => [
			"en" => "Cookies marketing",
			"pl" => "Cookies marketingowe"
		],
	];

	if ( $language !== null ) {
		$result = [];
		foreach ( $translations as $k => $v ) {
			$result[$k] = $v[$language] ?? $k;
		}

		return $result;
	}

	return $translations;
}

function __tr( $key, $language = FH_LANGUAGE ) {
	$translations = getAllTranslations();
	if ( !$translations[$key][$language] ) {
		return $key;
	}

	return $translations[$key][$language];
}


