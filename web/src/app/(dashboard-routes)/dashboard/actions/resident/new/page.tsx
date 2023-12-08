import { ResidentForm } from "@/components/member/residentForm";


export default function NewResident() {
  return (
    <section className="flex flex-col justify-center items-center mb-12">
      <h1 className="text-4xl mt-2 mb-4">Registrar morador</h1>
      <ResidentForm/>
    </section>
  )
}