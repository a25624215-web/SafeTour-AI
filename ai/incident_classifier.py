"""
AI Incident Classifier module for SafeTour-AI.
Classifies unstructured natural language safety reports into categories and risk levels.
"""

from typing import Dict, Any

INCIDENT_KEYWORDS = {
    "harassment": {"category": "Harassment / Eve Teasing", "severity": "high"},
    "theft": {"category": "Theft / Pickpocketing", "severity": "medium"},
    "scam": {"category": "Tourist Scam", "severity": "medium"},
    "accident": {"category": "Road / Physical Accident", "severity": "high"},
    "lost": {"category": "Lost Tourist / Path Deviation", "severity": "medium"},
    "lighting": {"category": "Infrastructure - Poor Lighting", "severity": "low"},
    "landslide": {"category": "Natural Disaster - Landslide", "severity": "critical"},
    "fog": {"category": "Hazardous Weather - Dense Fog", "severity": "medium"},
    "ice": {"category": "Road Hazard - Black Ice", "severity": "high"},
    "animal": {"category": "Wildlife Encounter", "severity": "high"}
}


class IncidentClassifier:
    @staticmethod
    def classify(description: str) -> Dict[str, Any]:
        text = description.lower()
        matched_categories = []
        highest_severity = "low"
        severity_rank = {"low": 1, "medium": 2, "high": 3, "critical": 4}

        for keyword, info in INCIDENT_KEYWORDS.items():
            if keyword in text:
                matched_categories.append(info["category"])
                if severity_rank.get(info["severity"], 1) > severity_rank.get(highest_severity, 1):
                    highest_severity = info["severity"]

        if not matched_categories:
            matched_categories = ["General Safety Observation"]
            highest_severity = "medium"

        return {
            "predicted_categories": matched_categories,
            "primary_category": matched_categories[0],
            "recommended_severity": highest_severity,
            "confidence_score": 0.88 if len(matched_categories) > 0 else 0.50
        }
