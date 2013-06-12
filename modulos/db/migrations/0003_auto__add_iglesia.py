# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Iglesia'
        db.create_table(u'db_iglesia', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('nombre', self.gf('django.db.models.fields.CharField')(unique=True, max_length=100)),
            ('codigo', self.gf('django.db.models.fields.CharField')(unique=True, max_length=4)),
            ('sede', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('proposito', self.gf('django.db.models.fields.TextField')(blank=True)),
            ('tel', self.gf('django.db.models.fields.CharField')(max_length=100, blank=True)),
            ('direccion', self.gf('django.db.models.fields.CharField')(max_length=100)),
            ('address', self.gf('modulos.django_google_maps.fields.AddressField')(max_length=200)),
            ('geolocation', self.gf('modulos.django_google_maps.fields.GeoLocationField')(max_length=100)),
            ('zoom', self.gf('django.db.models.fields.CharField')(max_length=3)),
            ('user', self.gf('django.db.models.fields.related.OneToOneField')(to=orm['usuarios.Usuario'], unique=True)),
        ))
        db.send_create_signal(u'db', ['Iglesia'])


    def backwards(self, orm):
        # Deleting model 'Iglesia'
        db.delete_table(u'db_iglesia')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'db.iglesia': {
            'Meta': {'object_name': 'Iglesia'},
            'address': ('modulos.django_google_maps.fields.AddressField', [], {'max_length': '200'}),
            'codigo': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '4'}),
            'direccion': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'geolocation': ('modulos.django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '100'}),
            'proposito': ('django.db.models.fields.TextField', [], {'blank': 'True'}),
            'sede': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'tel': ('django.db.models.fields.CharField', [], {'max_length': '100', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['usuarios.Usuario']", 'unique': 'True'}),
            'zoom': ('django.db.models.fields.CharField', [], {'max_length': '3'})
        },
        u'db.region': {
            'Meta': {'object_name': 'Region'},
            'center': ('modulos.django_google_maps.fields.GeoLocationField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'nombre': ('django.db.models.fields.CharField', [], {'max_length': '40'}),
            'path': ('modulos.django_google_maps.fields.PathField', [], {}),
            'user': ('django.db.models.fields.related.OneToOneField', [], {'to': u"orm['usuarios.Usuario']", 'unique': 'True'}),
            'zoom': ('django.db.models.fields.CharField', [], {'max_length': '3'})
        },
        u'usuarios.usuario': {
            'Meta': {'object_name': 'Usuario'},
            'ambito': ('django.db.models.fields.CharField', [], {'default': "'0'", 'max_length': '1'}),
            'email': ('django.db.models.fields.EmailField', [], {'unique': 'True', 'max_length': '255', 'db_index': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Group']", 'symmetrical': 'False', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_admin': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_padre': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        }
    }

    complete_apps = ['db']