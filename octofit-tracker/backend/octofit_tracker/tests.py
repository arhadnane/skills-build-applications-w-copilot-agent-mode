from datetime import date
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Activity, Leaderboard, OctoFitUser, Team, Workout


class OctoFitApiTests(APITestCase):
	def setUp(self):
		self.user = OctoFitUser.objects.create(
			username='spiderman',
			email='spiderman@marvel.com',
			password='testpass123',
		)
		self.team = Team.objects.create(name='Team Marvel')
		self.team.members.add(self.user)
		Activity.objects.create(
			user=self.user,
			activity_type='Swing Training',
			duration=60,
			date=date.today(),
		)
		Leaderboard.objects.create(user=self.user, score=999)
		Workout.objects.create(
			name='Hero Cardio',
			description='High-intensity hero workout',
			exercises=[{'name': 'Burpees', 'reps': 20}],
		)

	def test_root_points_to_api_root(self):
		response = self.client.get('/')
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('users', response.data)
		self.assertIn('/api/users/', response.data['users'])

	def test_api_root_available(self):
		response = self.client.get(reverse('api-root'))
		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('activities', response.data)
		self.assertIn('teams', response.data)
		self.assertIn('leaderboard', response.data)
		self.assertIn('workouts', response.data)

	def test_collection_endpoints_available(self):
		endpoints = [
			'/api/users/',
			'/api/teams/',
			'/api/activities/',
			'/api/leaderboard/',
			'/api/workouts/',
		]
		for endpoint in endpoints:
			response = self.client.get(endpoint)
			self.assertEqual(response.status_code, status.HTTP_200_OK)
