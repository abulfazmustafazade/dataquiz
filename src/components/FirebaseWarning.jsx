import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function FirebaseWarning() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} className="text-amber-600" />
          </div>
          <h1 className="text-2xl font-black text-gray-900">Firebase qurulmayıb</h1>
        </div>
        <p className="text-gray-700 mb-4">Saytın işləməsi üçün Firebase Realtime Database lazımdır:</p>
        <ol className="space-y-3 text-gray-700 mb-6 list-decimal list-inside">
          <li><a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-purple-600 font-bold hover:underline">Firebase Console</a>-a daxil olun və yeni layihə yaradın</li>
          <li>Sol menyudan <b>Realtime Database</b> → <b>Create Database</b> → <b>Test mode</b></li>
          <li>Project Settings → Web app əlavə edin və <code className="bg-gray-100 px-2 py-1 rounded">firebaseConfig</code>-i kopyalayın</li>
          <li><code className="bg-gray-100 px-2 py-1 rounded">src/lib/firebase.js</code> faylında config-i əvəz edin</li>
        </ol>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 text-sm text-purple-900">
          <b>Tam təlimat:</b> README.md faylına baxın
        </div>
      </motion.div>
    </div>
  );
}
