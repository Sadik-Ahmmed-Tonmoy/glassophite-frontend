"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartRewardsProps {
  points: number
}

export default function CartRewards({ points }: CartRewardsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [pointsApplied, setPointsApplied] = useState(false)
  const [pointsToRedeem, setPointsToRedeem] = useState(points)

  const handleApplyPoints = () => {
    setPointsApplied(true)
    setIsExpanded(false)
  }

  const handlePointsChange = (value: number) => {
    if (value < 0) return
    if (value > points) return
    setPointsToRedeem(value)
  }

  return (
    <div className="px-4 py-3">
      {pointsApplied ? (
        <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center">
            <Check size={18} className="text-blue-600 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">Reward Points Applied</p>
              <p className="text-xs text-blue-600">
                {pointsToRedeem} points redeemed (₹{pointsToRedeem / 10})
              </p>
            </div>
          </div>
          <button
            onClick={() => setPointsApplied(false)}
            className="text-xs text-blue-700 hover:text-blue-900 underline"
          >
            Remove
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center text-blue-600">
              <Gift size={18} className="mr-2" />
              <span className="text-sm font-medium">Reward Points</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">{points}</span>
              <ChevronRight
                size={18}
                className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
              />
            </div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-2 px-2">
                  <p className="text-sm text-gray-600 mb-3">
                    You have {points} reward points (₹{points / 10} value)
                  </p>

                  <div className="mb-3">
                    <label htmlFor="points-slider" className="block text-xs text-gray-500 mb-1">
                      Points to redeem: {pointsToRedeem}
                    </label>
                    <input
                      id="points-slider"
                      type="range"
                      min="0"
                      max={points}
                      value={pointsToRedeem}
                      onChange={(e) => handlePointsChange(Number.parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0</span>
                      <span>{points}</span>
                    </div>
                  </div>

                  <Button onClick={handleApplyPoints} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Redeem {pointsToRedeem} points (₹{pointsToRedeem / 10})
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
