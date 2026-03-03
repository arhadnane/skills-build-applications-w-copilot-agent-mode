from django.core.management.base import BaseCommand
from django.utils import timezone
from octofit_tracker.models import OctoFitUser, Activity, Team, Leaderboard, Workout
import datetime


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Clearing existing data...')
        Leaderboard.objects.all().delete()
        Activity.objects.all().delete()
        Team.objects.all().delete()
        Workout.objects.all().delete()
        OctoFitUser.objects.all().delete()

        self.stdout.write('Creating users...')
        users_data = [
            {'username': 'thundergirl', 'email': 'thundergirl@example.com', 'password': 'pass1234'},
            {'username': 'octocat', 'email': 'octocat@example.com', 'password': 'pass1234'},
            {'username': 'codercat', 'email': 'codercat@example.com', 'password': 'pass1234'},
            {'username': 'devninja', 'email': 'devninja@example.com', 'password': 'pass1234'},
            {'username': 'bytehero', 'email': 'bytehero@example.com', 'password': 'pass1234'},
        ]
        users = [OctoFitUser.objects.create(**u) for u in users_data]

        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Weightlifting']
        for i, user in enumerate(users):
            Activity.objects.create(
                user=user,
                activity_type=activity_types[i % len(activity_types)],
                duration=30 + i * 5,
                date=datetime.date.today() - datetime.timedelta(days=i),
            )
            Activity.objects.create(
                user=user,
                activity_type=activity_types[(i + 2) % len(activity_types)],
                duration=45 + i * 3,
                date=datetime.date.today() - datetime.timedelta(days=i + 1),
            )

        self.stdout.write('Creating teams...')
        team_a = Team.objects.create(name='Team Alpha')
        team_a.members.set(users[:3])
        team_b = Team.objects.create(name='Team Beta')
        team_b.members.set(users[2:])

        self.stdout.write('Creating leaderboard entries...')
        scores = [950, 870, 720, 680, 540]
        for user, score in zip(users, scores):
            Leaderboard.objects.create(user=user, score=score)

        self.stdout.write('Creating workouts...')
        workouts_data = [
            {
                'name': 'Morning Cardio Blast',
                'description': 'A high-energy cardio workout to start your day.',
                'exercises': [
                    {'name': 'Jumping Jacks', 'sets': 3, 'reps': 30},
                    {'name': 'High Knees', 'sets': 3, 'duration': '1 min'},
                    {'name': 'Burpees', 'sets': 3, 'reps': 10},
                ]
            },
            {
                'name': 'Strength Builder',
                'description': 'Build muscle with this full-body strength workout.',
                'exercises': [
                    {'name': 'Push-ups', 'sets': 4, 'reps': 15},
                    {'name': 'Squats', 'sets': 4, 'reps': 20},
                    {'name': 'Plank', 'sets': 3, 'duration': '45 sec'},
                ]
            },
            {
                'name': 'Flexibility Flow',
                'description': 'Improve flexibility and recovery with this yoga-inspired routine.',
                'exercises': [
                    {'name': 'Sun Salutation', 'sets': 3, 'duration': '2 min'},
                    {'name': 'Hip Flexor Stretch', 'sets': 2, 'duration': '1 min'},
                    {'name': 'Downward Dog', 'sets': 3, 'duration': '1 min'},
                ]
            },
        ]
        for w in workouts_data:
            Workout.objects.create(**w)

        self.stdout.write(self.style.SUCCESS('Database populated successfully!'))
