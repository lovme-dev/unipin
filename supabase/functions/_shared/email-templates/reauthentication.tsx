/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

const LOGO_URL = 'https://tnrezspunvvlbvhcvqbq.supabase.co/storage/v1/object/public/email-assets/unipin-logo.svg'

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img src={LOGO_URL} alt="UniPin" width="140" height="40" style={logo} />
        <Heading style={h1}>Confirm reauthentication</Heading>
        <Text style={text}>Use the code below to confirm your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>This code will expire shortly. If you didn't request this, you can safely ignore this email.</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#0F172A', fontFamily: "'Segoe UI', Arial, sans-serif" }
const container = { padding: '30px 25px', backgroundColor: '#1A2236', borderRadius: '12px', margin: '20px auto' }
const logo = { margin: '0 0 24px' }
const h1 = { fontSize: '24px', fontWeight: 'bold' as const, color: '#F2F2F2', margin: '0 0 20px' }
const text = { fontSize: '14px', color: '#A0AEC0', lineHeight: '1.6', margin: '0 0 25px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '28px', fontWeight: 'bold' as const, color: '#ED6B26', margin: '0 0 30px', letterSpacing: '4px' }
const footer = { fontSize: '12px', color: '#64748B', margin: '30px 0 0' }
