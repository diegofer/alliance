from fabric.api import * 
from fabric.colors import green, red 

def host_type():
	run('uname -s')