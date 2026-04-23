'use client'
import {useState, useMemo, useEffect, useRef} from 'react'
import {useSearchParams} from 'next/navigation'
import {PhotosHero} from '../../src/PhotosHero'
import {PhotosFilterBar} from '../../src/PhotosFilterBar'
import {PhotoGrid} from '../../src/PhotoGrid'
import {PhotoLightbox} from '../../src/PhotoLightbox'
import {Footer} from '../../src/Footer'
import type {PhotosData, PhotoItem} from '../../src/types/photos'

interface PhotosContentProps {
  data: PhotosData
}

export default function PhotosContent({data}: PhotosContentProps) {
  const searchParams = useSearchParams()
  const queryMatchId = searchParams.get('match')

  const nonEmptyMatches = useMemo(
    () => data.matches.filter((m) => m.files.length > 0),
    [data.matches]
  )

  const [filter, setFilter] = useState(() => {
    if (queryMatchId && nonEmptyMatches.some((m) => m.id === queryMatchId)) {
      return queryMatchId
    }
    return nonEmptyMatches[0]?.id ?? ''
  })
  const [openPhoto, setOpenPhoto] = useState<PhotoItem | null>(null)
  const isFirstRender = useRef(true)

  // Scroll to top when filter changes (but not on initial render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    window.scrollTo({top: 0, behavior: 'smooth'})
  }, [filter])

  const photoItems: PhotoItem[] = useMemo(() => {
    return nonEmptyMatches.flatMap((match) =>
      match.files.map((file) => ({
        ...file,
        matchId: match.id,
        matchLabel: match.label,
        matchDate: match.date,
        teamColor: match.teamColor,
        competition: match.competition,
        aspect: file.imageMediaMetadata
          ? file.imageMediaMetadata.width / file.imageMediaMetadata.height
          : file.videoMediaMetadata
            ? file.videoMediaMetadata.width / file.videoMediaMetadata.height
            : 1.5,
      }))
    )
  }, [nonEmptyMatches])

  const totals: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const match of nonEmptyMatches) {
      counts[match.id] = match.files.length
    }
    return counts
  }, [nonEmptyMatches])

  const visible: PhotoItem[] = useMemo(() => {
    return photoItems
      .filter((p) => p.matchId === filter)
      .sort(
        (a, b) =>
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      )
  }, [photoItems, filter])

  const activeMatch = nonEmptyMatches.find((m) => m.id === filter)

  return (
    <>
      <PhotosHero stats={data.stats} />
      <PhotosFilterBar
        matches={nonEmptyMatches}
        activeFilter={filter}
        onFilterChange={setFilter}
        totals={totals}
      />
      <PhotoGrid
        photos={visible}
        match={activeMatch}
        onOpen={setOpenPhoto}
      />
      <PhotoLightbox
        photo={openPhoto}
        photos={visible}
        matches={nonEmptyMatches}
        onClose={() => setOpenPhoto(null)}
        onNavigate={setOpenPhoto}
      />
      <Footer />
    </>
  )
}
