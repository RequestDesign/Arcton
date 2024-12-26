import $ from 'jquery'
import Inputmask from 'inputmask'
import Swiper from 'swiper';
import { Navigation, Pagination, Grid, Autoplay } from 'swiper/modules';
import { rem } from '../utils/constants'
import { Fancybox } from "@fancyapps/ui";
import { Switcher } from '../utils/Switcher';
import Form from '../utils/Form';

$(function () {
    dropDowns()
    modalsHandler()
    initSwipers()
    initFancybox()
    initSwitchers()

    const phone = document.querySelectorAll('input[name="phone"]')
    if (phone) {
        phone.forEach((e) => {
            new Inputmask('+7 (999) 999-99-99').mask($(e));
        })


    }
    document.querySelectorAll('.form')
        .forEach((f) => {
            if(f){
                new Form(f)

            }
        })

})


function dropDowns() {
    const ddBtn = $('.drop-down-target'),
        html = $('html')
    if (!ddBtn) return

    ddBtn.on('click', (e) => {
        e.preventDefault()
        if (e.currentTarget.classList.contains('_opened')) {
            e.currentTarget.classList.remove('_opened')
            e.currentTarget.closest('.drop-down-container')
                .classList.remove('_opened')
            if (e.currentTarget.dataset.lock) {
                html.removeClass('_locked')
            }



        } else {
            e.currentTarget.classList.add('_opened')
            e.currentTarget.closest('.drop-down-container')
                .classList.add('_opened')
            if (e.currentTarget.dataset.lock) {
                html.addClass('_locked')
            }
        }

    })

}
function initSwipers() {
    const heading = document.querySelector('.heading')
    if (heading) {

        new Swiper(heading.querySelector('.swiper'), {
            modules: [Pagination, Autoplay],
            loop: true,
            slidesPerView: 1,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            pagination: {
                el: heading.querySelector('.swiper-pagination'),
                type: 'bullets'
            },
            on: {
                init: (swiper) => {
                    heading.classList.add('_swiper-autoplay')
                },
                autoplayStop: (swiper) => {
                    heading.classList.remove('_swiper-autoplay')
                }
            }


        })

    }
    const ourServices = document.querySelector('.our-services')
    if (ourServices) {
        new Swiper(ourServices.querySelector('.swiper'), {
            modules: [Navigation],
            loop: false,
            spaceBetween: rem(3),
            slidesPerView: 1.2,
            centeredSlides: true,
            breakpoints: {
                768: {
                    centeredSlides: false,
                    slidesPerView: 3,
                    spaceBetween: rem(3),
                }
            },
            navigation: {
                prevEl: ourServices.querySelector('.swiper-btn-prev'),
                nextEl: ourServices.querySelector('.swiper-btn-next'),
            }

        })
    }
    const images = document.querySelector('.swiper.active-projects__images'),
        table = document.querySelector('.swiper.active-projects__body')

    if (images && table) {


        const bar = document.querySelector('.main.active-projects'),
            btnNext = bar.querySelector('.swiper-btn-next'),
            btnPrev = bar.querySelector('.swiper-btn-prev')


        const imagesSwiper = new Swiper(images, {
            simulateTouch: false,
            loop: false,
            slidesPerView: 1,
            spaceBetween: rem(2),
            initialSlide: 0,
            breakpoints: {
                768: {

                    slidesPerView: 1,

                }
            },

        })
        const tableSwiper = new Swiper(table, {
            modules: [Pagination],
            loop: false,
            simulateTouch: false,
            slidesPerView: 1,
            spaceBetween: rem(2),
            initialSlide: 0,

            breakpoints: {
                768: {
                    slidesPerView: 1,


                }
            },
            pagination: {
                el: bar.querySelector('.swiper-pagination'),
                type: "bullets"
            },
            on: {


            }
        })

        imagesSwiper.on('slideChange', (swiper) => {

            if (window.innerWidth < 768) {
                const active = swiper.activeIndex;
                tableSwiper.slideTo(active)
            }


        })
        tableSwiper.on('slideChange', (swiper) => {

            if (window.innerWidth < 768) {
                const active = swiper.activeIndex;
                imagesSwiper.slideTo(active)
            }

        })
        btnNext.addEventListener('click', (ev) => {
            imagesSwiper.slideNext()
            tableSwiper.slideNext()
        })
        btnPrev.addEventListener('click', (ev) => {
            imagesSwiper.slidePrev()
            tableSwiper.slidePrev()
        })
    }

    const projectsComplited = document.querySelector('.complited-projects')
    if (projectsComplited) {
        new Swiper(projectsComplited.querySelector('.swiper'), {
            modules: [Navigation],
            slidesPerView: 1.2,
            spaceBetween: rem(3),
            centeredSlides: true,
            breakpoints: {
                768: {
                    centeredSlides: false,
                    slidesPerView: 2
                }
            },
            navigation: {
                nextEl: projectsComplited.querySelector('.swiper-btn-next'),
                prevEl: projectsComplited.querySelector('.swiper-btn-prev')
            }

        })
    }

    const mails = document.querySelector('.mails')
    if (mails) {

        new Swiper(mails.querySelector('.swiper'), {
            slidesPerView: 1.3,
            spaceBetween: rem(3),
            centeredSlides: true,
            breakpoints: {
                768: {
                    centeredSlides: false,
                    slidesPerView: 4
                }

            }
        })
    }

    const projectsDetail = document.querySelector('.projects-detail')
    if (projectsDetail) {
        new Swiper(projectsDetail.querySelector('.swiper'), {
            modules: [Pagination, Autoplay],
            loop: true,
            slidesPerView: 1,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            pagination: {
                el: projectsDetail.querySelector('.swiper-pagination'),
                type: 'bullets'
            },
            on: {
                init: (swiper) => {
                    projectsDetail.classList.add('_swiper-autoplay')

                },
                autoplayStop: (swiper) => {
                    projectsDetail.classList.remove('_swiper-autoplay')
                }
            }


        })

    }

    const history = document.querySelector('.about.history')
    if (history) {
        new Swiper(history.querySelector('.swiper'), {
            modules: [Navigation],
            slidesPerView: 1,
            navigation: {
                prevEl: history.querySelector('.swiper-btn-prev'),
                nextEl: history.querySelector('.swiper-btn-next')
            }
        })
    }


    const aboutAdv = document.querySelector('.about.advantages')
    if (aboutAdv) {
        new Swiper(aboutAdv.querySelector('.swiper'), {
            modules: [Navigation],
            slidesPerView: 1.3,
            centeredSlides: true,
            spaceBetween: rem(3),
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    centeredSlides: false
                }
            },
            navigation: {
                prevEl: aboutAdv.querySelector('.swiper-btn-prev'),
                nextEl: aboutAdv.querySelector('.swiper-btn-next')
            }
        })
    }

    const newsDetail = document.querySelector('.news-detail__body-right')
    if (newsDetail) {
        new Swiper(newsDetail.querySelector('.swiper'), {
            modules: [Pagination, Autoplay],
            loop: true,
            slidesPerView: 1,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            pagination: {
                el: newsDetail.querySelector('.swiper-pagination'),
                type: 'bullets'
            },
            on: {
                init: (swiper) => {
                    newsDetail.classList.add('_swiper-autoplay')

                },
                autoplayStop: (swiper) => {
                    newsDetail.classList.remove('_swiper-autoplay')
                }
            }


        })

    }

}
function modalsHandler() {


    const modalOpeners = $('.modal-opener'),
        modalClosers = $('.modal-closer'),
        html = $('html')


    if (!modalOpeners || !modalClosers) return

    modalOpeners.on('click', (ev) => {
        const { modal } = ev.currentTarget.dataset

        $(`.modal-${modal}`)
            .fadeIn()
            .addClass('_opened')
        html.addClass('_lock')
    })


    modalClosers.on('click', (ev) => {
        const { classList } = ev.target
        if (!classList.contains('modal-closer')) return

        if (classList.contains('modal')) {
            $(ev.target).fadeOut().removeClass('_opened')

        } else {
            $(ev.target.closest('.modal')).fadeOut().removeClass('_opened')

        }
        html.removeClass('_lock')
    })
}

function initSwitchers() {
    const projects = document.querySelector('.projects')
    if (projects) {
        new Switcher(projects, 0)
    }
}

function initFancybox() {
    const anytarget = document.querySelector('[data-fancybox]')
    if (!anytarget) return



    Fancybox.bind('[data-fancybox]', {
        Thumbs: false,
        Toolbar: {
            display: {
                left: [],
                middle: ["infobar"],
                right: ["close"],
            },
        },
    })
}