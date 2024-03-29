import { Menu } from "@/components/menu";
import LoggingTable from "@/components/logging/loggingTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Monitoramento de operadores",
};

export default function Logging() {
  return (
    <>
      <Menu url={`/dashboard`} />
      <section className="max-w-5xl mx-auto mb-24">
        <h1 className="text-4xl text-center">Monitoramento de operadores</h1>
        <div className="max-h-[60vh] overflow-x-auto">
          <LoggingTable />
        </div>
      </section>
    </>
  );
}
