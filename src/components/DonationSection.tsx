import { Button } from '@/components/ui/button';

export default function DonationSection() {
  return (
    <section className="py-20 bg-gradient-to-r from-green-400 to-blue-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Support Our Mission</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">Your donation helps us provide critical resources and support to communities affected by disasters. Every contribution makes a difference.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button size="lg" variant="secondary">Donate $10</Button>
          <Button size="lg" variant="secondary">Donate $25</Button>
          <Button size="lg" variant="secondary">Donate $50</Button>
          <Button size="lg" variant="secondary">Donate $100</Button>
          <Button size="lg" variant="secondary">Custom Amount</Button>
        </div>
      </div>
    </section>
  )
}

