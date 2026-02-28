'use client'
import Link from 'next/link'
import {useState} from 'react'
import {PolicyModal} from './PolicyModal'
import {ReturnPolicy} from './policies/ReturnPolicy'
import {PrivacyPolicy} from './policies/PrivacyPolicy'

export const Footer = () => {
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false)
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)

  return (
    <>
      <footer className="flex flex-col justify-center items-center py-8 text-gooner-red gap-2">
        <div>© {new Date().getFullYear()} Miami Gooners</div>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href={'mailto:info@miamigooners.com'}
            className="hover:text-white transition-colors"
          >
            info@miamigooners.com
          </Link>
          <button
            onClick={() => setPrivacyPolicyOpen(true)}
            className="hover:text-white transition-colors cursor-pointer underline"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setReturnPolicyOpen(true)}
            className="hover:text-white transition-colors cursor-pointer underline"
          >
            Return Policy
          </button>
        </div>
      </footer>

      <PolicyModal
        open={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </PolicyModal>

      <PolicyModal
        open={returnPolicyOpen}
        onClose={() => setReturnPolicyOpen(false)}
        title="Return and Refund Policy"
      >
        <ReturnPolicy />
      </PolicyModal>
    </>
  )
}
