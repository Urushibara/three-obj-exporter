/**
 * Original: @author mrdoob / http://mrdoob.com/
 *
 * + Supports multiple materials by Urushibara
 */

THREE.OBJExporter = function () {
	this.materials = {}
}

THREE.OBJExporter.prototype = {

	constructor: THREE.OBJExporter,

	parse: function ( object ) {

		var output = '';

		var indexVertex = 0;
		var indexVertexUvs = 0;
		var indexNormals = 0;

		var vertex = new THREE.Vector3();
		var normal = new THREE.Vector3();
		var uv = new THREE.Vector2();

		var i, j, k, l, m, face = [];

		var parseMesh = function ( mesh ) {

			var nbVertex = 0;
			var nbNormals = 0;
			var nbVertexUvs = 0;

			var geometry = mesh.geometry;

			var normalMatrixWorld = new THREE.Matrix3();

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( mesh );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );
				var normals = geometry.getAttribute( 'normal' );
				var uvs = geometry.getAttribute( 'uv' );
				var groups = geometry.groups;
				var indices = geometry.getIndex();

				// name of the mesh object
				output += 'o ' + mesh.name + '\n';

				// name of the mesh material
				if ( mesh.material ) {

					if( mesh.material.name ) {

						output += 'usemtl ' + mesh.material.name + '\n';

						this.materials[ mesh.material.name ] = mesh.material;

					} else {

						output += 'usemtl ' + mesh.material.id + '\n';

						this.materials[ mesh.material.id ] = mesh.material;

					}

				}

				// vertices

				if ( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex ++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( mesh.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				// uvs

				if ( uvs !== undefined ) {

					for ( i = 0, l = uvs.count; i < l; i ++, nbVertexUvs ++ ) {

						uv.x = uvs.getX( i );
						uv.y = uvs.getY( i );

						// transform the uv to export format
						output += 'vt ' + uv.x + ' ' + uv.y + '\n';

					}

				}

				// normals

				if ( normals !== undefined ) {

					normalMatrixWorld.getNormalMatrix( mesh.matrixWorld );

					for ( i = 0, l = normals.count; i < l; i ++, nbNormals ++ ) {

						normal.x = normals.getX( i );
						normal.y = normals.getY( i );
						normal.z = normals.getZ( i );

						// transfrom the normal to world space
						normal.applyMatrix3( normalMatrixWorld );

						// transform the normal to export format
						output += 'vn ' + normal.x + ' ' + normal.y + ' ' + normal.z + '\n';

					}

				}

				// faces

				if ( indices !== null ) {

					let group_index = 0

					for ( i = 0, l = indices.count; i < l; i += 3 ) {

						for ( m = 0; m < 3; m ++ ) {

							j = indices.getX( i + m ) + 1;

							face[ m ] = ( indexVertex + j ) + ( normals || uvs ? '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + ( normals ? '/' + ( indexNormals + j ) : '' ) : '' );

						}

						// multiple material support
						if (groups && groups[ group_index ] && groups[ group_index ].start == i && mesh.material[ groups[ group_index ].materialIndex ]){

							if (mesh.material[ groups[ group_index ].materialIndex ].hasOwnProperty("name")) {

								output += 'usemtl ' + mesh.material[ groups[ group_index ].materialIndex ].name + '\n';
								
								this.materials[ mesh.material[ groups[ group_index ].materialIndex ].name ] = mesh.material[ groups[ group_index ].materialIndex ];

							} else {

								output += 'usemtl ' + groups[ group_index ].materialIndex + '\n';

								this.materials[ groups[ group_index ].materialIndex ] = mesh.material[ groups[ group_index ].materialIndex ];

							}

							++ group_index

						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\n";

					}

				} else {

					let group_index = 0

					for ( i = 0, l = vertices.count; i < l; i += 3 ) {

						for ( m = 0; m < 3; m ++ ) {

							j = i + m + 1;

							face[ m ] = ( indexVertex + j ) + ( normals || uvs ? '/' + ( uvs ? ( indexVertexUvs + j ) : '' ) + ( normals ? '/' + ( indexNormals + j ) : '' ) : '' );

						}

						// multiple material support
						if (groups && groups[ group_index ] && groups[ group_index ].start == i && mesh.material[ groups[ group_index ].materialIndex ]){

							if (mesh.material[ groups[ group_index ].materialIndex ].hasOwnProperty("name")) {

								output += 'usemtl ' + mesh.material[ groups[ group_index ].materialIndex ].name + '\n';
								
								this.materials[ mesh.material[ groups[ group_index ].materialIndex ].name ] = mesh.material[ groups[ group_index ].materialIndex ];

							} else {

								output += 'usemtl ' + groups[ group_index ].materialIndex + '\n';

								this.materials[ groups[ group_index ].materialIndex ] = mesh.material[ groups[ group_index ].materialIndex ];

							}

							++ group_index

						}

						// transform the face to export format
						output += 'f ' + face.join( ' ' ) + "\n";

					}

				}

			} else {

				console.warn( 'THREE.OBJExporter.parseMesh(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;
			indexVertexUvs += nbVertexUvs;
			indexNormals += nbNormals;

		};

		var parseLine = function ( line ) {

			var nbVertex = 0;

			var geometry = line.geometry;
			var type = line.type;

			if ( geometry instanceof THREE.Geometry ) {

				geometry = new THREE.BufferGeometry().setFromObject( line );

			}

			if ( geometry instanceof THREE.BufferGeometry ) {

				// shortcuts
				var vertices = geometry.getAttribute( 'position' );

				// name of the line object
				output += 'o ' + line.name + '\n';

				if ( vertices !== undefined ) {

					for ( i = 0, l = vertices.count; i < l; i ++, nbVertex ++ ) {

						vertex.x = vertices.getX( i );
						vertex.y = vertices.getY( i );
						vertex.z = vertices.getZ( i );

						// transfrom the vertex to world space
						vertex.applyMatrix4( line.matrixWorld );

						// transform the vertex to export format
						output += 'v ' + vertex.x + ' ' + vertex.y + ' ' + vertex.z + '\n';

					}

				}

				if ( type === 'Line' ) {

					output += 'l ';

					for ( j = 1, l = vertices.count; j <= l; j ++ ) {

						output += ( indexVertex + j ) + ' ';

					}

					output += '\n';

				}

				if ( type === 'LineSegments' ) {

					for ( j = 1, k = j + 1, l = vertices.count; j < l; j += 2, k = j + 1 ) {

						output += 'l ' + ( indexVertex + j ) + ' ' + ( indexVertex + k ) + '\n';

					}

				}

			} else {

				console.warn( 'THREE.OBJExporter.parseLine(): geometry type unsupported', geometry );

			}

			// update index
			indexVertex += nbVertex;

		};

		let self = this

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				parseMesh.call( self, child );

			}

			if ( child instanceof THREE.Line ) {

				parseLine.call( self, child );

			}

		} );

		return output;

	},

	// for MTL --------------------------------------------------------------------------
	generate_mtl: function(){

		var output = "";

		Object.keys( this.materials ).forEach( name => {

			output += "newmtl " + name + "\n";

			if ( this.materials[ name ].color && !this.materials[ name ].color.equals(new THREE.Color(1, 1, 1)) ) {

				output += "Ka " + this.materials[ name ].color.r + " " + this.materials[ name ].color.g + " " + this.materials[ name ].color.b + "\n";

			}

			if ( this.materials[ name ].specular ) {

				output += "Ks " + this.materials[ name ].specular.r + " " + this.materials[ name ].specular.g + " " + this.materials[ name ].specular.b + "\n";

			}

			if ( this.materials[ name ].emissive && !this.materials[ name ].emissive.equals(new THREE.Color(0, 0, 0)) ) {

				output += "Ke " + 
					( this.materials[ name ].emissive.r * this.materials[ name ].emissiveIntensity ) + " " + 
					( this.materials[ name ].emissive.g * this.materials[ name ].emissiveIntensity ) + " " + 
					( this.materials[ name ].emissive.b * this.materials[ name ].emissiveIntensity ) + "\n";

			}
			
			if ( this.materials[ name ].opacity < 1 ) {

				output += "d " + this.materials[ name ].opacity + "\n";

			}

			if ( this.materials[ name ].map ) {

				output += "map_Kd ";

				if ( this.materials[ name ].map.name ) {

					output += this.materials[ name ].map.name + "\n";
				
				}
				
				// if used TextureLoader
				else if ( this.materials[ name ].map.image && this.materials[ name ].map.image.src ) {

					// parse filename
					var filename = this.materials[ name ].map.image.src.match( ".+/(.+?)([\?#;].*)?$" )

					if ( filename ) {

						// has path ?
						if ( filename.length > 1 ) {

							output += filename[1] + "\n";

						} else {

							output += filename[0] + "\n";

						}

					} else {

						// default temporary name
						output += this.materials[ name ].map.id + ".png\n";

					}

				} else {

					// default temporary name
					output += this.materials[ name ].map.id + ".png\n";

				}

			}

			if ( this.materials[ name ].alphaMap ) {

				output += "map_d ";

				if ( this.materials[ name ].alphaMap.name ) {

					output += this.materials[ name ].alphaMap.name + "\n";
				
				}
				
				// if used TextureLoader
				else if ( this.materials[ name ].alphaMap.image && this.materials[ name ].alphaMap.image.src ) {

					// parse filename
					var filename = this.materials[ name ].alphaMap.image.src.match( ".+/(.+?)([\?#;].*)?$" )

					if ( filename ) {

						// has path ?
						if ( filename.length > 1 ) {

							output += filename[1] + "\n";

						} else {

							output += filename[0] + "\n";

						}

					} else {

						// default temporary name
						output += this.materials[ name ].alphaMap.id + ".png\n";

					}

				} else {

					// default temporary name
					output += this.materials[ name ].alphaMap.id + ".png\n";

				}

			}

			if ( this.materials[ name ].bumpMap ) {

				output += "bump ";

				if ( this.materials[ name ].bumpMap.name ) {

					output += this.materials[ name ].bumpMap.name + "\n";
				
				}
				
				// if used TextureLoader
				else if ( this.materials[ name ].bumpMap.image && this.materials[ name ].bumpMap.image.src ) {

					// parse filename
					var filename = this.materials[ name ].bumpMap.image.src.match( ".+/(.+?)([\?#;].*)?$" )

					if ( filename ) {

						// has path ?
						if ( filename.length > 1 ) {

							output += filename[1] + "\n";

						} else {

							output += filename[0] + "\n";

						}

					} else {

						// default temporary name
						output += this.materials[ name ].bumpMap.id + ".png\n";

					}

				} else {

					// default temporary name
					output += this.materials[ name ].bumpMap.id + ".png\n";

				}

			}

			if ( this.materials[ name ].aoMap ) {

				output += "disp ";

				if ( this.materials[ name ].aoMap.name ) {

					output += this.materials[ name ].aoMap.name + "\n";
				
				}
				
				// if used TextureLoader
				else if ( this.materials[ name ].aoMap.image && this.materials[ name ].aoMap.image.src ) {

					// parse filename
					var filename = this.materials[ name ].aoMap.image.src.match( ".+/(.+?)([\?#;].*)?$" )

					if ( filename ) {

						// has path ?
						if ( filename.length > 1 ) {

							output += filename[1] + "\n";

						} else {

							output += filename[0] + "\n";

						}

					} else {

						// default temporary name
						output += this.materials[ name ].aoMap.id + ".png\n";

					}

				} else {

					// default temporary name
					output += this.materials[ name ].aoMap.id + ".png\n";

				}

			}

			if ( this.materials[ name ].emissiveMap ) {

				output += "map_Ke ";

				if ( this.materials[ name ].emissiveMap.name ) {

					output += this.materials[ name ].emissiveMap.image.name + "\n";
				
				}
				
				// if used TextureLoader
				else if ( this.materials[ name ].emissiveMap.image && this.materials[ name ].emissiveMap.image.src ) {

					// parse filename
					var filename = this.materials[ name ].emissiveMap.image.src.match( ".+/(.+?)([\?#;].*)?$" )

					if ( filename ) {

						// has path ?
						if ( filename.length > 1 ) {

							output += filename[1] + "\n";

						} else {

							output += filename[0] + "\n";

						}

					} else {

						// default temporary name
						output += this.materials[ name ].emissiveMap.id + ".png\n";

					}

				} else {

					// default temporary name
					output += this.materials[ name ].emissiveMap.id + ".png\n";

				}

			}

		})

		output += "newmtl none\n";

		return output;

	}

};
