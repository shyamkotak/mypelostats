import Header from "@/components/Header";
import WorkoutStats from "@/app/components/WorkoutStats";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <WorkoutStats />
      </main>
      <Footer />
    </>
  );
}
