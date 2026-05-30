'use client'
import { motion } from 'framer-motion'
import TopBar from '@/components/layout/TopBar'
import ActiveDemandTile from '@/components/tiles/ActiveDemandTile'
import NextEventTile from '@/components/tiles/NextEventTile'
import WeatherTileCmp from '@/components/tiles/WeatherTileCmp'
import LTAAlertsTile from '@/components/tiles/LTAAlertsTile'
import TopZoneTile from '@/components/tiles/TopZoneTile'

const tileVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.4, 0, 0.2, 1] }
  })
}

const TILES = [
  { id: 'demand', component: ActiveDemandTile },
  { id: 'event', component: NextEventTile },
  { id: 'weather', component: WeatherTileCmp },
  { id: 'lta', component: LTAAlertsTile },
  { id: 'zone', component: TopZoneTile },
]

export default function CommandCentre() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <TopBar title="Command Centre" />
      <div className="flex-1 p-6">
        <p className="text-slate-400 text-sm mb-6 font-medium">
          Real-time intelligence dashboard — Singapore taxi network
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '210px' }}>
          {TILES.map(({ id, component: Tile }, i) => (
            <motion.div
              key={id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={tileVariants}
              className="h-full"
            >
              <Tile />
            </motion.div>
          ))}
        </div>

        {/* Quick stats bar */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Fleet Zones', value: '15', sub: 'Active coverage areas', accent: '#0057FF' },
            { label: 'Avg Response', value: '4.2 min', sub: 'Passenger wait time', accent: '#059669' },
            { label: 'Surge Areas', value: '3', sub: 'Currently active', accent: '#F59E0B' },
            { label: 'Next Forecast', value: '30s', sub: 'Until data refresh', accent: '#7C3AED' },
          ].map(({ label, value, sub, accent }) => (
            <div key={label} className="bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">{label}</p>
              <p className="font-black text-2xl mt-1" style={{ color: accent }}>{value}</p>
              <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
