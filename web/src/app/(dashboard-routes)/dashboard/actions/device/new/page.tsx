import { DeviceForm } from "@/components/device/deviceForm";
import { Menu } from "@/components/menu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar dispositivo",
};
export default function AddDevice() {
  return (
    <>
      <Menu />
      <section className="flex flex-col justify-center items-center mb-12">
        <h1 className="text-4xl mt-2 mb-4">Registrar Dispositivo</h1>
        <DeviceForm />
      </section>
    </>
  );
}
