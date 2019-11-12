//Top Authors widget

import React, { Component } from 'react'
import Slider from "react-slick";

const topAuthors = [
 
]

export default class TopAuthors extends Component {
   render() {
      const settings = {
         dots: false,
         infinite: true,
         speed: 500,
         slidesToShow: 1,
         slidesToScroll: 1,
         autoplay: true,
      };
      return (
         <div className="top-author-wrap rct-block">
            <div className="bg-primary text-white pt-4 rounded-top">
               <h4 className="mb-0 text-center">Top Authors</h4>
            </div>
            <Slider {...settings}>
             
            </Slider>
         </div>
      )
   }
}
