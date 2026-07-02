'use client';

import { useQuery } from '@tanstack/react-query';
import { getDriverStandings, getConstructorStandings } from '@/lib/api/f1';
import type { DriverStanding, ConstructorStanding } from '@/types/f1';

export function useLiveStandings() {
  const drivers = useQuery<DriverStanding[]>({
    queryKey: ['driver-standings'],
    queryFn: () => getDriverStandings(),
    staleTime: 300000,
    refetchInterval: 300000,
  });

  const constructors = useQuery<ConstructorStanding[]>({
    queryKey: ['constructor-standings'],
    queryFn: () => getConstructorStandings(),
    staleTime: 300000,
    refetchInterval: 300000,
  });

  return { drivers, constructors };
}
