from django.contrib import admin
from .models import OctoFitUser, Activity, Team, Leaderboard, Workout

admin.site.register(OctoFitUser)
admin.site.register(Activity)
admin.site.register(Team)
admin.site.register(Leaderboard)
admin.site.register(Workout)
