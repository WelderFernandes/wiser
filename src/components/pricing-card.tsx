"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface PricingCardProps {
  title: string
  price: string
  description: string
  features: string[]
  buttonText: string
  buttonVariant: "default" | "outline"
  popular?: boolean
}

export function PricingCard({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant,
  popular = false,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      <Card
        className={`h-full glass-card border-primary/20 overflow-hidden ${popular ? "pricing-highlight shadow-xl" : "shadow-lg"}`}
      >
        {popular && (
          <div className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/2">
            <span className="inline-flex items-center gap-1 bg-gradient-to-r from-primary to-primary/80 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              <Sparkles className="h-3 w-3" />
              Mais popular
            </span>
          </div>
        )}
        <CardHeader className={`${popular ? "pb-6" : "pb-4"}`}>
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="mt-4 flex items-baseline">
            <span className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              {price}
            </span>
            <span className="ml-1 text-muted-foreground">/mês</span>
          </div>
          <p className="mt-2 text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <div className="mr-2 h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
        <CardFooter>
          <Button
            variant={buttonVariant}
            className={`w-full ${buttonVariant === "default" ? "bg-primary hover:bg-primary/90 text-white" : "border-primary/20 hover:bg-primary/10"}`}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

