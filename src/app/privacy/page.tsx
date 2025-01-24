import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy - SAVIOUR",
  description: "Privacy Policy for the SAVIOUR disaster management platform",
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>1. Introduction</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Welcome to SAVIOUR&apos;s Privacy Policy. Your privacy is critically important to us. This Privacy Policy
            document contains types of information that is collected and recorded by SAVIOUR and how we use it.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>2. Data Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We collect several different types of information for various purposes to provide and improve our Service to
            you:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>
              Personal Data: While using our Service, we may ask you to provide us with certain personally identifiable
              information that can be used to contact or identify you.
            </li>
            <li>Usage Data: We may also collect information on how the Service is accessed and used.</li>
            <li>
              Location Data: We collect real-time location information to provide critical services during emergencies.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>3. Use of Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>SAVIOUR uses the collected data for various purposes:</p>
          <ul className="list-disc list-inside mt-2">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To provide emergency assistance and disaster management services</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>4. Data Sharing and Disclosure</CardTitle>
        </CardHeader>
        <CardContent>
          <p>We may disclose your personal information in the good faith belief that such action is necessary to:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Comply with a legal obligation</li>
            <li>Protect and defend the rights or property of SAVIOUR</li>
            <li>Prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>Protect the personal safety of users of the Service or the public</li>
            <li>Protect against legal liability</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>5. Security of Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet,
            or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to
            protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>6. Your Data Protection Rights</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            SAVIOUR aims to take reasonable steps to allow you to correct, amend, delete, or limit the use of your
            Personal Data. You have the following data protection rights:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>The right to access, update or to delete the information we have on you.</li>
            <li>The right of rectification.</li>
            <li>The right to object.</li>
            <li>The right of restriction.</li>
            <li>The right to data portability.</li>
            <li>The right to withdraw consent.</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>7. Changes to This Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
            Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior
            to the change becoming effective and update the &quot;effective date&quot; at the top of this Privacy
            Policy.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>8. Contact Us</CardTitle>
        </CardHeader>
        <CardContent>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-disc list-inside mt-2">
            <li>By email: privacy@saviour.org</li>
            <li>By phone number: +91 8306721779</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

