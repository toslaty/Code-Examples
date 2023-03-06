import React from "react"
import HomeHeader from "../components/home_banner.js"
import Introduction from '../components/introduction.js'
import Picsandtextbelow from "../components/horizontalbigpicstextbelow.js"

export async function getServerSideProps(){
    const collections = ['home-banner','intros','theteams']
    let data_arr = []

    for(let i=0;i < collections.length; i++){
        let req = await fetch('http://localhost:1337/api/'+collections[i]+'?populate=*')
        let jason = await req.json()
        data_arr.push(jason)
    }

  if (!data_arr) {
    return {
      notFound: true,
    }
  }
    return {
        props:  {data_arr},
    }
}

export default function Home(data) {

    const section1 = data.data_arr[0].data
    const section2 = data.data_arr[1].data
    const section3 = data.data_arr[2].data

    return (
        <div>
         <HomeHeader data={section1}/>
         <Introduction data={section2}/>
         <Picsandtextbelow data={section3}/>
        {/* <Carousel query="theteams"/>  */}
         </div>
     )
}

