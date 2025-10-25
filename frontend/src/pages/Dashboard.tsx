import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Filter } from 'lucide-react'
import { Layout } from '../components/layout/Layout'
import { DealCard } from '../components/deals/DealCard'
import { DealForm } from '../components/deals/DealForm'
import { dealsApi } from '../services/api'
import type { DealCreate } from '../types'
import { DealStage } from '../types'
import { getStageLabel } from '../utils/format'

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false)
  const [stageFilter, setStageFilter] = useState<DealStage | ''>('')
  const queryClient = useQueryClient()

  // Fetch deals
  const { data, isLoading, error } = useQuery({
    queryKey: ['deals', stageFilter],
    queryFn: () => dealsApi.list(stageFilter || undefined),
  })

  // Create deal mutation
  const createMutation = useMutation({
    mutationFn: (data: DealCreate) => dealsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] })
      setShowForm(false)
    },
  })

  const handleCreateDeal = (data: DealCreate) => {
    // Clean up empty fields before sending to API
    const cleanedData = {
      ...data,
      expected_close_date: data.expected_close_date ? data.expected_close_date : null,
      notes: data.notes || null,
      contact_person: data.contact_person || null,
      contact_email: data.contact_email || null,
      contact_phone: data.contact_phone || null,
    }
    createMutation.mutate(cleanedData as DealCreate)
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-600">
            Fehler beim Laden der Deals. Bitte versuchen Sie es erneut.
          </p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Pipeline</h1>
          <p className="text-gray-600 mt-1">
            {data?.total || 0} Deals insgesamt
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Stage Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value as DealStage | '')}
              className="input py-2"
            >
              <option value="">Alle Stages</option>
              {Object.values(DealStage).map((stage) => (
                <option key={stage} value={stage}>
                  {getStageLabel(stage)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Neuer Deal</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 mt-4">Deals werden geladen...</p>
        </div>
      )}

      {/* Deals Grid */}
      {!isLoading && data && (
        <>
          {data.deals.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                Keine Deals gefunden. Erstellen Sie Ihren ersten Deal!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create Deal Modal */}
      {showForm && (
        <DealForm
          onSubmit={handleCreateDeal}
          onClose={() => setShowForm(false)}
          isLoading={createMutation.isPending}
        />
      )}
    </Layout>
  )
}
