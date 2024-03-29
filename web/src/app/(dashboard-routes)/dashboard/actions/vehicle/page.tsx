import VehicleTable from "@/components/vehicle/vehicleTable";
import { Menu } from "@/components/menu";
import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FilePlus, FileSearch } from "@phosphor-icons/react/dist/ssr";
import Search from "@/components/search";

export const metadata: Metadata = {
  title: "Veículos",
};

export default async function Vehicle({
  searchParams,
}: {
  searchParams?: {
    lobby?: string;
  };
}) {
  const lobby = searchParams?.lobby || "";
  return (
    <>
      <Menu url={`/dashboard/actions?id=${lobby}`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center mb-2">Veículos</h1>
        <div className="flex justify-end mb-4">
          <Search placeholder="Buscar..." pagination={false} />
        </div>
        <div className="max-h-[60vh] overflow-x-auto">
          <VehicleTable lobby={lobby} />
        </div>
        <div className="mt-6 flex gap-4 items-center">
          <Link
            href={`vehicle/new?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FilePlus size={24} /> Registrar veículo
            </p>
          </Link>
          <Link
            href={`resident?lobby=${lobby}`}
            className={buttonVariants({ variant: "default" })}
          >
            <p className="flex gap-2 text-xl items-center">
              <FileSearch size={24} /> Moradores
            </p>
          </Link>
        </div>
      </section>
    </>
  );
}
