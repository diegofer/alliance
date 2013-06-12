# -*- coding: utf-8 -*-
from django.forms import ModelForm

from modulos.db.models import Region

class RegionForm(ModelForm):
	class Meta:
		model = Region
