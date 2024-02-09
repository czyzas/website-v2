<?php
/*
	Template name: Raporty
*/
?>
<?php get_header(); ?>
<main class="subpage report">
	<?php
	include( locate_template( 'partials/top.php' ) );
	?>
    <section class="reports margin-bottom">
		<div class="container-fluid page-container">

	        <div class="row">
	            <div class="col-12 filter-wrapper">
					<p class="filter-title"><?php echo __tr('raporty'); ?></p>
	                <div class="filter">
						<?php if ( ! get_field( 'filtr_niestandardowy' ) ) {
							$active_year = $currentYear = intval(date( "Y" ));
							if ( isset( $_GET['rok'] ) ) {
								$active_year = intval($_GET['rok']);
							}
							?>
							<?php for ( $i = $currentYear; $i >= get_field( 'rok_rozpoczecia_raportowania' ); $i -- ) { ?>
	                            <a href="#" class="<?php echo $active_year === $i ? 'active' : '' ?>" data-year="<?php echo $i ?>"><?php echo $i ?></a>
							<?php }
						} else if ( have_rows( 'taby_filtra' ) ) {
							$counter = 0;
							while ( have_rows( 'taby_filtra' ) ) : the_row();
								if ( $counter == 0 ) {
									$active_year = $currentYear = get_sub_field( 'tab' );
								}
								?>
	                            <a href="#" class="<?php echo $counter === 0 ? 'active' : '' ?>"
	                               data-year="<?php the_sub_field( 'tab' ) ?>"><?php echo the_sub_field( 'tab' ) ?></a>
								<?php
								$counter ++;
							endwhile;
						}
						?>
	                </div>
	            </div>
	        </div>

	        <div class="row">
	            <div class="col-12">
	                <div class="detailed-filter">
	                    <input type="text" id="keyword" name="keyword" value="<?php echo isset($_GET['slowo-kluczowe']) ? $_GET['slowo-kluczowe'] : '' ?>"
	                           placeholder="<?php echo __tr('slowo_kluczowe'); ?>">
	                    <span class="filter-label">
							<?php echo __tr('zakres_dat'); ?>
	                    </span>
	                    <input id="date-from" class="datepicker" type="text" name="date-from" placeholder="dd/mm/yyyy">
	                    <input id="date-to" class="datepicker" type="text" name="date-to" placeholder="dd/mm/yyyy">

	                    <a href="#" class="search hvr-forward">
							<?php echo __tr('szukaj'); ?>
							<?php echo esc_html( $link_title ); ?><?php get_template_part( 'dist/images/arrow-link.svg' ) ?>
						</a>
	                </div>
	            </div>
	        </div>

	        <div class="row">
	            <div class="col-12">
	                <div class="table-container">
	                    <table class="reports-table">
							<?php
							$hideNumberCells = get_field( 'chowaj_numer_raportu' );
							?>
	                        <thead>
	                        <tr>
	                            <th><?php echo __tr('data_godzina'); ?></th>
								<?php if ( ! $hideNumberCells ) { ?>
	                                <th><?php echo __tr('numer'); ?></th>
								<?php } ?>
	                            <th><?php echo __tr('tytul'); ?></th>
	                        </tr>
	                        </thead>
	                        <tbody>
							<?php
							$reports = new WP_Query( array(
									'post_type'      => get_field( 'typ_raportow' ),
									'posts_per_page' => - 1,
									'orderby'        => 'date',
									'order'          => 'DESC'
								)
							);

							if ( $reports->have_posts() ) {
								while ( $reports->have_posts() ) {
									$reports->the_post();

									$year = intval(get_the_date( 'Y' ));
									if ( get_field( 'tab_docelowy' ) ) {
										$year = intval(get_field( 'tab_docelowy' ));
									}
									?>

	                                <tr
	                                        data-year="<?php echo $year ?>"
	                                        data-date="<?php echo get_the_date( 'd/m/Y' ) ?>"
	                                        style="<?php echo $year !== $active_year ? 'display: none;' : '' ?>">
	                                    <td>
											<?php echo get_the_date( 'd/m/Y' ) ?>
											<?php if ( get_field( 'pokazuj_godzine' ) ) {
												echo get_the_time();
											} ?>
	                                    </td>

										<?php if ( ! $hideNumberCells ) { ?>
	                                        <td class="number"><?php the_field( 'numer_raportu' ) ?></td>
										<?php } ?>
	                                    <td class="name"><a href="<?php the_permalink() ?>"><?php the_title() ?></a></td>
	                                    <td class="social">
	                                        <a href="#" class="hvr-grow prettySocial"
	                                           data-type="facebook"
	                                           data-url="<?php the_permalink() ?>"
	                                           data-title="<?php the_title() ?>">
	                                            <i class="fab fa-facebook-f"></i>
	                                        </a>
	                                        <a href="#" class="hvr-grow prettySocial"
	                                           data-type="twitter"
	                                           data-url="<?php the_permalink() ?>"
	                                           data-description="<?php the_title() ?>">
	                                            <i class="fab fa-twitter"></i>
	                                        </a>
	                                        <a href="#" class="hvr-grow prettySocial"
	                                           data-type="linkedin"
	                                           data-url="<?php the_permalink() ?>"
	                                           data-description="<?php the_title() ?>"
	                                        ><i class="fab fa-linkedin"></i></a>
	                                    </td>
	                                </tr>
									<?php
								}
								wp_reset_postdata();
							}
							?>
	                        </tbody>
	                    </table>
	                </div>
	            </div>
	        </div>

		</div>
    </section>

	<?php include(locate_template('partials/pages.php'));	 ?>
</main>

<?php get_footer(); ?>
