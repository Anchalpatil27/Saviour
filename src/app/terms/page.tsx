import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms of Service - SAVIOUR",
  description: "Terms of Service for the SAVIOUR disaster management platform",
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms of Service</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Acceptance of Terms</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            By accessing or using the SAVIOUR disaster management platform, you agree to comply with and be bound by
            these Terms of Service. If you do not agree to these terms, please do not use our services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Description of Services</CardTitle>
        </CardHeader>
        <CardContent>
          <p>SAVIOUR provides a comprehensive disaster management platform that includes:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Real-time emergency alerts and notifications</li>
            <li>Resource tracking and management during crises</li>
            <li>Emergency navigation and evacuation assistance</li>
            <li>Community support networks for disaster response</li>
            <li>Educational resources on disaster preparedness and recovery</li>
          </ul>
          <p className="mt-2">
            These services are designed to assist individuals, communities, and organizations in preparing for,
            responding to, and recovering from natural disasters and other emergencies.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. User Obligations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>As a user of SAVIOUR, you agree to:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Provide accurate and current information when using our services</li>
            <li>Use the platform responsibly, especially during emergency situations</li>
            <li>Not interfere with or disrupt the functionality of our services</li>
            <li>Respect the privacy and rights of other users</li>
            <li>Not use our platform for any unlawful purposes</li>
            <li>Follow all guidelines and instructions provided during emergencies</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Emergency Services Disclaimer</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            While SAVIOUR strives to provide accurate and timely information during emergencies, we are not a substitute
            for official emergency services. In life-threatening situations, always contact your local emergency
            services (such as 911) first. SAVIOUR is a supplementary tool to assist in disaster management and should
            not be relied upon as the sole source of emergency information or assistance.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Data Usage and Privacy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            To provide our services effectively, SAVIOUR collects and processes user data, including location
            information. By using our platform, you consent to this data collection and processing. We are committed to
            protecting your privacy and will only use your data in accordance with our Privacy Policy. For full details
            on how we handle your information, please refer to our Privacy Policy.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Intellectual Property</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            All content and functionality on the SAVIOUR platform, including but not limited to text, graphics, logos,
            icons, and software, is the property of SAVIOUR or its content suppliers and protected by international
            copyright laws. Users may not copy, reproduce, modify, or distribute any content from our platform without
            prior written consent from SAVIOUR.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Limitation of Liability</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            SAVIOUR provides its services on an "as is" and "as available" basis. While we strive for accuracy and
            reliability, we cannot guarantee that our services will be uninterrupted, timely, or error-free, especially
            during large-scale emergencies. SAVIOUR shall not be liable for any direct, indirect, incidental,
            consequential, or exemplary damages resulting from the use or inability to use our services.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>8. Modifications to Service</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            SAVIOUR reserves the right to modify, suspend, or discontinue any part of our services at any time, with or
            without notice. We may also update these Terms of Service periodically. Continued use of our platform after
            any changes constitutes acceptance of the new terms.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>9. Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p>If you have any questions about these Terms of Service, please contact us:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Email: legal@saviour.org</li>
            <li>Phone: +91 8306721779</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

