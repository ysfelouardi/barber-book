// This script adds test appointments to your Firebase database
// Run this with: node scripts/add-test-appointments.js

const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore, Timestamp } = require('firebase-admin/firestore')

// You'll need to add your Firebase service account key here
// Download it from Firebase Console > Project Settings > Service Accounts
// For now, this will use the default configuration
initializeApp()

const db = getFirestore()

const testAppointments = [
  {
    name: 'John Smith',
    phone: '+1234567890',
    service: 'haircut',
    date: '2024-12-15',
    time: '10:00',
    status: 'pending',
    createdAt: Timestamp.now(),
  },
  {
    name: 'Maria Garcia',
    phone: '+34612345678',
    service: 'both',
    date: '2024-12-16',
    time: '14:30',
    status: 'confirmed',
    createdAt: Timestamp.now(),
  },
  {
    name: 'Ahmed Hassan',
    phone: '+33123456789',
    service: 'beard',
    date: '2024-12-14',
    time: '16:00',
    status: 'cancelled',
    createdAt: Timestamp.now(),
  },
  {
    name: 'Lisa Johnson',
    phone: '+44987654321',
    service: 'haircut',
    date: '2024-12-17',
    time: '11:00',
    status: 'pending',
    createdAt: Timestamp.now(),
  },
  {
    name: 'Carlos Rodriguez',
    phone: '+52555123456',
    service: 'both',
    date: '2024-12-18',
    time: '15:30',
    status: 'confirmed',
    createdAt: Timestamp.now(),
  },
]

async function addTestAppointments() {
  try {
    console.log('Adding test appointments to Firebase...')

    const batch = db.batch()

    testAppointments.forEach((appointment) => {
      const docRef = db.collection('appointments').doc()
      batch.set(docRef, appointment)
    })

    await batch.commit()
    console.log(`✅ Successfully added ${testAppointments.length} test appointments!`)

    // List all appointments to verify
    const snapshot = await db.collection('appointments').get()
    console.log(`📋 Total appointments in database: ${snapshot.size}`)
  } catch (error) {
    console.error('❌ Error adding test appointments:', error)
  }
}

addTestAppointments()
