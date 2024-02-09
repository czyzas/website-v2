(function () {
    'use strict';
    $(document).ready(function () {

        // GSAP elements animations HOME
        if (typeof ScrollTrigger !== 'undefined' && typeof gsap !== 'undefined'){
            if($(".gsap-from-top").length) {
                gsap.set(".gsap-from-top", {
                    opacity: 0,
                    y: -100
                });
                ScrollTrigger.batch(".gsap-from-top", {
                    onEnter: batch => gsap.to(batch, {
                        opacity: 1,
                        y: 0,
                        delay: .25,
                        duration: .5,
                        stagger: .25
                    }),
                    onLeave: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                y: -100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onEnterBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 1,
                                y: 0,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onLeaveBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                y: -100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    }
                });
            }

            if($(".gsap-from-bottom").length) {
                gsap.set(".gsap-from-bottom", {
                    opacity: 0,
                    y: 100
                });
                ScrollTrigger.batch(".gsap-from-bottom", {
                    onEnter: batch => {
                        gsap.to(batch, {
                            opacity: 1,
                            y: 0,
                            delay: .25,
                            duration: .5,
                            stagger: .25
                        });
                    },
                    onLeave: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                y: 100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onEnterBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 1,
                                y: 0,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onLeaveBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                y: 100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                });
            }

            if($(".gsap-from-left").length) {
                gsap.set(".gsap-from-left", {
                    opacity: 0,
                    x: -100
                });
                ScrollTrigger.batch(".gsap-from-left", {
                    onEnter: batch => gsap.to(batch, {
                        opacity: 1,
                        x: 0,
                        delay: .25,
                        duration: .5,
                        stagger: .25,
                        ease: 'power2.easeOut'
                    }),
                    onLeave: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                x: -100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onEnterBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 1,
                                x: 0,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onLeaveBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                x: -100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                });
            }

            if($(".gsap-from-right").length) {
                gsap.set(".gsap-from-right", {
                    opacity: 0,
                    x: 100
                });
                ScrollTrigger.batch(".gsap-from-right", {
                    onEnter: batch => gsap.to(batch, {
                        opacity: 1,
                        x: 0,
                        delay: .25,
                        duration: .5,
                        stagger: .25,
                        ease: 'power2.easeOut'
                    }),
                    onLeave: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                x: 100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onEnterBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 1,
                                x: 0,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onLeaveBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                x: 100,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                });
            }

            if($(".gsap-fade-in").length) {
                gsap.set(".gsap-fade-in", {
                    opacity: 0
                });
                ScrollTrigger.batch(".gsap-fade-in", {
                    onEnter: batch => gsap.to(batch, {
                        opacity: 1,
                        delay: .25,
                        duration: .5,
                        stagger: .25
                    }),
                    onLeave: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onEnterBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 1,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                    onLeaveBack: batch => {
                        if ($(batch).hasClass('gsap-multi')) {
                            gsap.to(batch, {
                                opacity: 0,
                                delay: .25,
                                duration: .5,
                                stagger: .25
                            })
                        }
                    },
                });
            }

            setTimeout(function () {
                ScrollTrigger.refresh();
            }, 1000);

            // refresh ScrollTrigger on accordion collapse and on tab open
            $('.accordion .collapse').on('shown.bs.collapse hidden.bs.collapse', function (e) {
                ScrollTrigger.refresh();
            });

            $('a[data-toggle="pill"]').on('shown.bs.tab', function (e) {
                ScrollTrigger.refresh();
            });
        }

    });
}(jQuery));
