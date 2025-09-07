import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <section className="space-y-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold">Contact</h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Naam"
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700"
        />
        <textarea
          placeholder="Bericht"
          className="w-full p-2 rounded-md bg-gray-800 border border-gray-700 h-32"
        />
        <Button type="submit">Versturen</Button>
      </form>
    </section>
  );
}
