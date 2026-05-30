'use client'
import { motion } from 'framer-motion'
import TopBar from '@/components/layout/TopBar'
import ActiveDemandTile from '@/components/tiles/ActiveDemandTile'
import NextEventTile from '@/components/tiles/NextEventTile'
import WeatherTileCmp from '@/components/tiles/WeatherTileCmp'
import ProfitTodayTile from '@/components/tiles/ProfitTodayTile'
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
  { id: 'demand', component: ActiveDemandTile, wide: false },
  { id: 'event', component: NextEventTile, wide: false },
  { id: 'weather', component: WeatherTileCmp, wide: false },
  { id: 'profit', component: ProfitTodayTile, wide: false },
  { id: 'lta', component: LTAAlertsTile, wide: false },
  { id: 'zone', component: TopZoneTile, wide: false },
]

export default function CommandCentre() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar title="Command Centre" />
      <div className="flex-1 p-6">
        <p className="text-[#9CA3AF] text-sm mb-6">
          Real-time intelligence dashboard — Singapore taxi network
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ gridAutoRows: '200px' }}>
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
            { label: 'Fleet Zones', value: '15', sub: 'Active coverage areas' },
            { label: 'Avg Response', value: '4.2 min', sub: 'Passenger wait time' },
            { label: 'Surge Areas', value: '3', sub: 'Currently active' },
            { label: 'Next Forecast', value: '30s', sub: 'Until data refresh' },
          ].map(({ label, value, sub }) => (
            <div key={label} className="bg-[#111827] border border-[#1F2937] rounded-xl px-5 py-4">
              <p className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wide">{label}</p>
              <p className="text-white font-black text-2xl mt-1">{value}</p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
