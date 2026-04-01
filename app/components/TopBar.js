'use client'
import GlobalNav from './GlobalNav'
import NotificationBell from './NotificationBell'

export default function TopBar() {
  return (
    <div style={{
      position: 'fixed', top: '20px', right: '24px', zIndex: 50,
      display: 'flex', alignItems: 'center', gap: '10px',
    }}>
      <NotificationBell />
      <GlobalNav />
    </div>
  )
}
