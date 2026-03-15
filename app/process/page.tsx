"use client";

import { formatPrice } from "@/lib/utils";

import { Navigation } from "@/components/navigation";
import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/config";
import {
  QrCode,
  CreditCard,
  Navigation as NavIcon,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Smartphone,
  Clock,
  FileText,
} from "lucide-react";

export default function ProcessPage() {
  const steps = [
    {
      number: 1,
      title: "Book Your Vehicle",
      description:
        "Select your preferred car, pick-up date, and drop-off date through our platform. Complete the booking and receive a confirmation with QR code.",
      icon: Smartphone,
      details: [
        "Browse our luxury fleet",
        "Select dates and location",
        "Get instant confirmation",
        "Receive booking QR code via email/SMS",
      ],
    },
    {
      number: 2,
      title: "QR Code Verification",
      description:
        "Upon arrival at our facility, our team will scan your unique QR code to verify your booking and identity. This ensures secure and seamless check-in.",
      icon: QrCode,
      details: [
        "Present your booking QR code",
        "Our staff scans for verification",
        "Match booking with your ID",
        "Real-time system confirmation",
      ],
    },
    {
      number: 3,
      title: "Manual Payment at Desk",
      description:
        "Complete your payment at our front desk. We accept all major credit cards, debit cards, and digital wallets. Receive an itemized invoice and payment receipt.",
      icon: CreditCard,
      details: [
        "Flexible payment methods accepted",
        "Transparent pricing breakdown",
        "Insurance options available",
        "Instant receipt generation",
      ],
    },
    {
      number: 4,
      title: "Vehicle Unlock via QR",
      description:
        "After payment, scan the vehicle QR code with your phone to unlock the car. The doors will automatically unlock, and the car is ready for pickup.",
      icon: CheckCircle2,
      details: [
        "Scan QR code on car window",
        "Automatic door unlock system",
        "Keys available at desk if needed",
        "Safety briefing provided",
      ],
    },
  ];

  const tracking = [
    {
      title: "Real-Time GPS Navigation",
      description:
        "All our vehicles come equipped with integrated GPS tracking. Monitor your route, get real-time traffic updates, and access turn-by-turn navigation.",
      icon: MapPin,
    },
    {
      title: "Distance & Mileage Tracking",
      description:
        "The vehicle automatically tracks distance covered and mileage. This data is recorded for reference and helps us maintain accurate records.",
      icon: NavIcon,
    },
    {
      title: "Fuel Utilization Monitoring",
      description:
        "Real-time fuel consumption tracking helps you monitor fuel efficiency. The system alerts you when fuel is running low.",
      icon: "⛽",
    },
    {
      title: "Performance Monitoring",
      description:
        "Track vehicle performance metrics, speed, acceleration, and other parameters through the in-car display system.",
      icon: "📊",
    },
  ];

  const damages = [
    {
      title: "Minor Damage (Dents, Scratches)",
      amount: `${siteConfig.ui.currencySymbol}2,000 - ${siteConfig.ui.currencySymbol}10,000`,
      description:
        "Small dents, scratches, and minor cosmetic damage are assessed on a case-by-case basis.",
    },
    {
      title: "Window/Glass Damage",
      amount: `${siteConfig.ui.currencySymbol}5,000 - ${siteConfig.ui.currencySymbol}25,000`,
      description:
        "Broken windows, mirrors, or glass components will be charged at replacement cost.",
    },
    {
      title: "Tire Damage",
      amount: `${siteConfig.ui.currencySymbol}3,000 - ${siteConfig.ui.currencySymbol}8,000`,
      description:
        "Punctured or damaged tires will be charged based on damage severity and type.",
    },
    {
      title: "Major Body Damage",
      amount: `${siteConfig.ui.currencySymbol}15,000 - ${siteConfig.ui.currencySymbol}1,00,000+`,
      description:
        "Significant structural damage, collision, or accident damage charged at repair cost.",
    },
    {
      title: "Total Loss / Theft",
      amount: "Full vehicle value",
      description:
        "In case of theft or total loss, the full insured value of the vehicle applies.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              How {siteConfig.brand.name} Works
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent, and secure rental process with cutting-edge
              tracking technology
            </p>
          </div>

          {/* Rental Process Steps */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Rental Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <Card
                    key={index}
                    className="p-6 bg-card border-border hover:shadow-lg transition-shadow"
                  >
                    <div className="flex gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <div className="inline-block px-3 py-1 bg-primary/10 rounded-full text-sm font-semibold text-primary mb-2">
                          Step {step.number}
                        </div>
                        <h3 className="text-xl font-bold text-foreground">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* Vehicle Tracking */}
          <section className="mb-20">
            <h2 className="text-3xl font-bold text-foreground mb-12">
              Advanced Vehicle Tracking
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Every {siteConfig.brand.name} vehicle is equipped with state-of-the-art tracking
              technology that monitors various aspects of your rental in
              real-time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tracking.map((feature, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-4">
                    {typeof feature.icon === "string" ? (
                      feature.icon
                    ) : (
                      <feature.icon className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* Damage & Loss Disclaimer */}
          <section className="mb-20">
            <div className="bg-gradient-to-r from-destructive/10 to-accent/10 border border-destructive/20 rounded-2xl p-8 mb-12">
              <div className="flex gap-4 items-start">
                <AlertCircle className="w-8 h-8 text-destructive flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">
                    Important Disclaimer
                  </h2>
                  <p className="text-muted-foreground">
                    Renters are responsible for any damage to the vehicle during
                    the rental period. This includes accidents, collisions,
                    theft, and mechanical damage caused by negligence or misuse.
                    Comprehensive insurance is available and recommended for all
                    rentals.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground mb-8">
              Damage Assessment & Charges
            </h2>
            <div className="space-y-4">
              {damages.map((damage, index) => (
                <Card
                  key={index}
                  className="p-6 bg-card border-border hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4 items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground mb-1">
                        {damage.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {damage.description}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-destructive">
                        {damage.amount}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Terms & Conditions */}
          <section>
            <Card className="p-8 bg-gradient-to-br from-card to-card border-border">
              <div className="flex gap-4 items-start mb-6">
                <FileText className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <h2 className="text-3xl font-bold text-foreground">
                  Terms & Conditions
                </h2>
              </div>

              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Vehicle Condition
                  </h3>
                  <p>
                    All vehicles are provided in excellent condition with full
                    tank of fuel or full charge (for electric vehicles). Return
                    the vehicle in the same condition. Any additional refueling
                    charges apply at {siteConfig.ui.currencySymbol}1.5x pump price if returned with less
                    fuel.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Mileage Limits
                  </h3>
                  <p>
                    Standard packages include 150 km per day. Additional
                    kilometers are charged at {siteConfig.ui.currencySymbol}15 per km. Exceeding mileage
                    without payment may result in additional charges based on
                    vehicle tracking records.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Insurance & Liability
                  </h3>
                  <p>
                    Basic third-party insurance is included with all rentals.
                    Comprehensive insurance (covering damages) is optional but
                    highly recommended. Renters without comprehensive insurance
                    are fully liable for all damages. Deductible amounts vary
                    based on damage type.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Accidents & Incidents
                  </h3>
                  <p>
                    In case of accident, collision, or any incident, immediately
                    report to our 24/7 helpline. Police complaint may be
                    required for major incidents. Failure to report may result
                    in additional penalties and loss of insurance coverage.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Late Returns
                  </h3>
                  <p>
                    Vehicles must be returned by the agreed drop-off time. Late
                    returns are charged at {siteConfig.ui.currencySymbol}500 per hour or the full daily rate
                    (whichever is higher). After 3 hours of delay, the vehicle
                    is considered as a new rental day.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Cancellation Policy
                  </h3>
                  <p>
                    Free cancellation up to 24 hours before pickup.
                    Cancellations within 24 hours incur 50% charges. No-shows
                    are charged at full rental amount. Cancellations due to
                    vehicle unavailability receive full refund.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Driver Requirements
                  </h3>
                  <p>
                    Valid driving license (minimum 2 years old),
                    government-issued ID, and proof of address are required.
                    International visitors must have International Driving
                    Permit (IDP) along with their home country license. Drivers
                    below 25 years may incur additional charges.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Prohibited Activities
                  </h3>
                  <p>
                    Off-road driving, racing, commercial use, towing, and
                    driving under influence are strictly prohibited. Smoking is
                    not allowed inside vehicles. Pets are allowed only with
                    prior approval. Violation of these terms may result in
                    immediate rental termination and full penalty charges.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Data & Privacy
                  </h3>
                  <p>
                    Vehicle tracking data is recorded for safety and security
                    purposes. GPS location, speed, and fuel data may be used for
                    billing and dispute resolution. Your data is protected under
                    our privacy policy and not shared with third parties.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">
                    Dispute Resolution
                  </h3>
                  <p>
                    Any disputes regarding charges, damage assessment, or
                    service will be resolved through our customer support team
                    within 7 business days. Refunds, if approved, will be
                    processed within 10-14 working days to your original payment
                    method.
                  </p>
                </div>
              </div>
            </Card>
          </section>

          {/* CTA */}
          <div className="text-center mt-16 space-y-4">
            <p className="text-lg text-muted-foreground">
              Ready to book your luxury rental?
            </p>
            <a
              href="/cars"
              className="inline-block px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-colors"
            >
              Browse Our Fleet
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
