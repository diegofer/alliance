# -*- coding: utf-8 -*-

from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField, AuthenticationForm


from django.db.models import Q

from modulos.usuarios.models import Usuario



class UserCreationForm(forms.ModelForm):
    """A form for creating new users. Includes all the required
    fields, plus a repeated password."""
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)

    class Meta:
        model = Usuario
        fields = ('email', 'ambito')

    def clean_password2(self):
        # Check that the two password entries match
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            raise forms.ValidationError("Passwords don't match")
        return password2

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super(UserCreationForm, self).save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):
    """A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
    password = ReadOnlyPasswordHashField()

    class Meta:
        model = Usuario

    def clean_password(self):
        # Regardless of what the user provides, return the initial value.
        # This is done here, rather than on the field, because the
        # field does not have access to the initial value
        return self.initial["password"]


class UsuarioAdmin(UserAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('email', 'ambito', 'is_admin', 'is_active')
    list_filter = ('is_admin', 'ambito', 'is_active',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permisos', {'fields': ('ambito', 'is_active', 'is_admin', 'is_superuser', 'groups', )}), #'user_permissions')}),                                     
        ('Datos Importantes', {'fields': ('last_login',)}),
    )
    readonly_fields = ('ambito', 'is_admin', 'is_superuser', 'groups',)


    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
        ),
    )
    
    search_fields = ('email',)
    ordering = ('email',)
    #radio_fields = {"ambito": admin.VERTICAL}
    #filter_horizontal = ('groups', ) # 'user_permissions',)
    
    # Guarda atomaticamente el id del usuario que lo crea
    def save_model(self, request, obj, form, change):
        if change:
            obj.save()

        elif request.user.is_superuser:  
            obj.ambito      = Usuario.NACIONAL
            obj.is_admin    = True
            obj.user_padre  = request.user.id 
            obj.save()

            g = Group.objects.get(name="nacional")
            obj.groups.add(g)      

        elif request.user.ambito == Usuario.NACIONAL:
            obj.ambito      = Usuario.REGIONAL
            obj.is_admin    = True
            obj.is_active   = False
            obj.user_padre  = request.user.id
            obj.save()

            g = Group.objects.get(name="regional")
            obj.groups.add(g) 

        elif request.user.ambito == Usuario.REGIONAL:
            obj.ambito      = Usuario.LOCAL
            obj.is_active   = False
            obj.user_padre  = request.user.id
            obj.save()

            g = Group.objects.get(name="local")
            obj.groups.add(g) 

        
    #Muestra en el admin solo los modelos creados por el usuario y al usuario mismo
    def queryset(self, request): 
        qs = super(UsuarioAdmin, self).queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(user_padre=request.user.id) #qs.filter(Q(user_padre=request.user.id) | Q(id=request.user.id))

admin.site.register(Usuario, UsuarioAdmin)

