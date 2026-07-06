"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Gift, ChevronDown, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetMyRewardsQuery } from "@/redux/features/user/rewardsApi"
import { useAppSelector } from "@/redux/hooks"

interface CartRewardsProps {
  pointsApplied: number   // currently redeemed points (0 if none)
  onApply: (points: number) => void
  onRemove: () => void
}

export default function CartRewards({ pointsApplied, onApply, onRemove }: CartRewardsProps) {
  const token = useAppSelector((state) => state.auth.access_token)
  const { data, isLoading } = useGetMyRewardsQuery(undefined, { skip: !token })

  const [isExpanded, setIsExpanded] = useState(false)
  const [pointsToRedeem, setPointsToRedeem] = useState(0)

  const rewardPoints = data?.data?.rewardPoints ?? 0
  const pointRate = data?.data?.pointRate ?? 0.1

  // Don't render for guests
  if (!token) return null

  if (isLoading) {
    return (
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 animate-pulse">
          <Gift size={18} className="text-blue-400" />
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-32" />
        </div>
      </div>
    )
  }

  const rewardValue = (rewardPoints * pointRate).toFixed(2)
  const appliedValue = (pointsApplied * pointRate).toFixed(2)

  return (
    <div className="px-4 py-3">
      {pointsApplied > 0 ? (
        <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Check size={18} className="text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Reward Points Applied</p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                {pointsApplied} points redeemed (৳{appliedValue})
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              onRemove()
              setPointsToRedeem(0)
            }}
            className="text-blue-700 hover:text-blue-900 p-1 rounded transition-colors"
            aria-label="Remove reward points"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <div className="flex items-center text-blue-600">
              <Gift size={18} className="mr-2" />
              <span className="text-sm font-medium">Reward Points</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{rewardPoints}</span>
              <ChevronDown
                size={18}
                className={`text-gray-400 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              />
            </div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-2 px-2">
                  {rewardPoints === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-2">
                      You have no reward points yet. Earn points with every purchase!
                    </p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        You have <span className="font-semibold text-blue-600">{rewardPoints}</span> reward points{" "}
                        <span className="text-gray-500">(৳{rewardValue} value)</span>
                      </p>

                      <div className="mb-4">
                        <label htmlFor="points-slider" className="block text-xs text-gray-500 mb-1">
                          Points to redeem:{" "}
                          <span className="font-semibold text-gray-700 dark:text-gray-200">{pointsToRedeem}</span>{" "}
                          <span className="text-gray-400">(৳{(pointsToRedeem * pointRate).toFixed(2)})</span>
                        </label>
                        <input
                          id="points-slider"
                          type="range"
                          min="0"
                          max={rewardPoints}
                          step="1"
                          value={pointsToRedeem}
                          onChange={(e) => setPointsToRedeem(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>0</span>
                          <span>{rewardPoints}</span>
                        </div>
                      </div>

                      <Button
                        onClick={() => {
                          if (pointsToRedeem > 0) {
                            onApply(pointsToRedeem)
                            setIsExpanded(false)
                          }
                        }}
                        disabled={pointsToRedeem === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                      >
                        Redeem {pointsToRedeem} points (৳{(pointsToRedeem * pointRate).toFixed(2)})
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
