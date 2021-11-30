import { FunctionComponent, useEffect, useState } from 'react'
import SwiperCore, { Autoplay, Pagination } from 'swiper'
/* eslint-disable import/no-unresolved */
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
/* eslint-enable */

import '../css/flag-icon.css'
import { patchSliderImages, patchSliderUrl } from '../config'

const { ipcRenderer } = window.require('electron')

SwiperCore.use([Autoplay, Pagination])

const Slider: FunctionComponent = () => {
    const launchUrl = (url: string) => ipcRenderer.send('launchUrl', { url })

    const [sliderImages, setSliderImages] = useState<Array<{image: string, url: string}> | null>(null)

    useEffect(() => {
        fetch(patchSliderUrl, { cache: 'no-store' })
            .then((response) => response.json())
            .then((result) => {
                setSliderImages(result)
            })
            .catch(() => {
                ipcRenderer.send('errorSliderFile')
            })
    }, [])

    return (
        <div className='pt-1 mb-3'>
            <Swiper
                loop
                centeredSlides
                spaceBetween={30}
                pagination={{
                    'clickable': true
                }}
                autoplay={{
                    'delay': 2500,
                    'disableOnInteraction': false
                }}
            >
                {
                    sliderImages?.map((image, index) => (
                        <SwiperSlide key={index}>
                            <a href='#' onClick={() => launchUrl(image.url)}>
                                <img src={patchSliderImages + image.image} alt={`img_${index}`} />
                            </a>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}
export default Slider
