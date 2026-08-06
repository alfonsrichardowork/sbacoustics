import HomeOld from "./components/home";
import ClientComp from "./components/clientcomp";

export default function oldPage() {
  return (
    <>
      <ClientComp text="Hello, World!"/>
      <HomeOld/>
    </>
  )
}
