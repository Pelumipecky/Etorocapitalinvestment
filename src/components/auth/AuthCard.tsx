import { ReactNode } from 'react'

interface AuthCardProps {
  title: string
  subtitle: string
  helper?: ReactNode
  children: ReactNode
}

function AuthCard({ title, subtitle, helper, children }: AuthCardProps) {
  return (
    <section className="auth">
      <div className="auth__card">
        <p className="eyebrow">eToro Trust Capital</p>
        <h1>{title}</h1>
        <p className="lead">{subtitle}</p>
        {children}
        {helper && <div className="auth__helper">{helper}</div>}
      </div>
      <div className="auth__panel">
        <img src="/images/img4.png" alt="eToro Trust Capital app" />
        <div>
          <h2>Security-first architecture</h2>
          <p>Institutional custody, audited smart contracts, and 24/7 monitoring keep assets safe.</p>
        </div>
      </div>
    </section>
  )
}

export default AuthCard
