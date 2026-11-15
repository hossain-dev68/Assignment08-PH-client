import { Banner } from "@/components/banner"
import { ExploreStudios } from "@/components/explore-studios"
import { HowItWorks } from "@/components/how-it-works"
import { ListYourStudio } from "@/components/list-your-studio"
import { Navbar } from "@/components/navbar"

export default function Home() {
  return (
    <>
      
      <Banner />
      <ListYourStudio />
      <HowItWorks />
      <ExploreStudios />
    </>
  )
}
