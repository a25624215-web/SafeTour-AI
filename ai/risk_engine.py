"""
AI Risk Engine for calculating localized real-time safety scores
based on environmental factors, time, proximity to hazard zones, and incident reports.
"""

from typing import Dict, Any, List


class RiskEngine:
    @staticmethod
    def calculate_safety_score(
        base_location_score: float = 8.5,
        crowd_density: str = "medium",
        lighting: str = "good",
        is_night: bool = False,
        recent_incident_count: int = 0,
        inside_hazard_zone: bool = False
    ) -> Dict[str, Any]:
        score = base_location_score

        # Crowd adjustments
        if crowd_density == "low":
            score -= 1.5
        elif crowd_density == "surge":
            score -= 0.5  # Pickpocketing/crowd crush risk

        # Lighting adjustments
        if lighting == "poor":
            score -= 2.0
        elif lighting == "moderate":
            score -= 0.5

        # Nighttime penalty
        if is_night:
            score -= 1.5

        # Incidents penalty
        score -= min(recent_incident_count * 0.8, 3.0)

        # Hazard zone penalty
        if inside_hazard_zone:
            score -= 2.5

        # Clamp between 1.0 and 10.0
        final_score = max(1.0, min(10.0, round(score, 2)))

        if final_score >= 7.5:
            tier = "SAFE"
            status_color = "#34d399"  # Emerald
        elif final_score >= 5.0:
            tier = "CAUTION"
            status_color = "#dfb15b"  # Gold
        else:
            tier = "HIGH RISK"
            status_color = "#ef4444"  # Red

        return {
            "safety_score": final_score,
            "tier": tier,
            "indicator_color": status_color,
            "is_alert_required": final_score < 6.0
        }
