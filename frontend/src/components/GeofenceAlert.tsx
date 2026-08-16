import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck, Radio } from 'lucide-react';
import { checkZoneSafety, ZoneCheckResponse } from '../services/api';

interface GeofenceAlertProps {
  latitude: number;
  longitude: number;
}

export const GeofenceAlert: React.FC<GeofenceAlertProps> = ({ latitude, longitude }) => {
  const [zoneStatus, setZoneStatus] = useState<ZoneCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchZone = async () => {
      setLoading(true);
      try {
        const data = await checkZoneSafety(latitude, longitude);
        if (isMounted) setZoneStatus(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchZone();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  if (!zoneStatus) return null;

  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-300 ${
        zoneStatus.inside_zone
          ? 'bg-[#38260f]/60 border-[#dfb15b]/45 shadow-[0_0_25px_rgba(223,177,91,0.2)] text-amber-200'
          : 'bg-[#0d2116]/60 border-emerald-500/25 text-emerald-200'
      }`}
    >
      <div className="flex items-start gap-3">
        {zoneStatus.inside_zone ? (
          <div className="w-8 h-8 rounded-xl bg-[#dfb15b]/20 border border-[#dfb15b]/40 flex items-center justify-center shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-[#dfb15b] animate-bounce" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#fffdfa] flex items-center gap-2">
              <span>{zoneStatus.inside_zone ? 'Geofence Caution Warning' : 'Alpine Perimeter Clear'}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#09150e] border border-[#dfb15b]/20 text-[#dfb15b]">
                {zoneStatus.risk_level}
              </span>
            </h4>
            <span className="text-[10px] font-mono text-sandstone-dark flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400" />
              <span>Haversine Live</span>
            </span>
          </div>

          <p className="text-xs text-sandstone-light mt-1 leading-relaxed">{zoneStatus.message}</p>

          {zoneStatus.zone_name && (
            <div className="mt-2 text-[11px] font-mono text-[#dfb15b] flex items-center gap-2">
              <span>Zone: {zoneStatus.zone_name}</span>
              <span>• Distance: {zoneStatus.distance_km} km</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
