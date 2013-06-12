# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import (
	BaseUserManager, AbstractBaseUser, PermissionsMixin
)


class UsuarioManager(BaseUserManager):
	
	def create_user(self, email, password=None):
		if not email:
			raise ValueError('Users must have an email address')

		user = self.model(
			email=UsuarioManager.normalize_email(email),
		)

		user.set_password(password)
		user.save(using=self._db)
		return user

	def create_superuser(self, email, password):
		user = self.create_user(
			email,
			password=password,			
		)
		user.is_admin = True
		user.is_superuser = True
		user.save(using=self._db)
		return user

		

class Usuario(AbstractBaseUser, PermissionsMixin):

	TOTAL    = 'total'#'0'
	NACIONAL = 'nacional'#'1'
	REGIONAL = 'regional'#'2'
	LOCAL    = 'local'#'3'

	AMBITOS_CHOICES = (
		(TOTAL, 'Total'),
	    (NACIONAL, 'Nacional'),
	    (REGIONAL, 'Regional'),
	    (LOCAL, 'Local'),
	)
	email      = models.EmailField(max_length=255, unique=True, db_index=True)
	ambito     = models.CharField(max_length=10, choices=AMBITOS_CHOICES, default=TOTAL)
	is_active  = models.BooleanField(default=True)
	is_admin   = models.BooleanField(default=False) 

	user_padre = models.IntegerField(default=0)

	objects = UsuarioManager()

	USERNAME_FIELD = 'email'
	#REQUIRED_FIELDS = ['username']

	def get_full_name(self):
	    return self.email

	def get_short_name(self):
	    return self.email

	def __unicode__(self):
	    return self.email

	@property
	def is_staff(self):
	    # Handle whether the user is a member of staff?"
	    return self.is_admin








