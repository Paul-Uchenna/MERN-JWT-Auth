import Header from "../components/Header";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        backgroundImage: "url('/bg_img.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Navbar />
      <Header />
    </div>
  );
}
