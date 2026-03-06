"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export function Contact() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Contact Us
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get in touch with our team for bookings, inquiries, or support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6 bg-card border-border flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Our Headquarters
                </h3>
                <p className="text-muted-foreground mt-2">
                  LuxeRide Premium Car Rentals
                  <br />
                  Level 12, UB City Tower
                  <br />
                  Vittal Mallya Road
                  <br />
                  Bengaluru, Karnataka 560001
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Phone Support
                </h3>
                <p className="text-muted-foreground mt-2">
                  Sales: +91 800-LUXERIDE
                  <br />
                  Support: +91 800-589-3743
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border flex items-start gap-4">
              <div className="bg-primary/20 p-3 rounded-full">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Email</h3>
                <p className="text-muted-foreground mt-2">
                  bookings@luxeride.in
                  <br />
                  support@luxeride.in
                </p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="p-8 bg-card border-border">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="firstName"
                    className="text-sm font-medium text-foreground"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium text-foreground"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium text-foreground"
                >
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <Button
                type="button"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3"
              >
                Send Message
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
