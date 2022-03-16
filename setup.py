from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in cre/__init__.py
from cre import __version__ as version

setup(
	name="cre",
	version=version,
	description="commercial real estate",
	author="JMG",
	author_email="grijalva10@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
