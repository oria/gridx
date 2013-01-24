define([], function () {
	/**
	 * Simple XML generator.
	 * @constructor
	 * @param nodeName The node name.
	 * @param attributes Optional attributes.
	 */
	function XmlNode(/**string*/ nodeName, /**Object?*/ attributes) {
		this.nodeName = nodeName;
		this.childNodes = [];
		this.attributes = attributes || {};
	}

	XmlNode.prototype = {
		constructor: XmlNode,
		nodeName: '',
		childNodes: [],
		attributes: {},

		/**
		 * Creates a new XML node and pushes it to the end of the current node.
		 * @param nodeName The node name for the new node.
		 * @param attributes Optional attributes for the new node.
		 * @returns {XmlNode} A new node.
		 */
		createNode: function (/**string*/ nodeName, /**Object?*/ attributes) {
			var node = new XmlNode(nodeName, attributes);
			this.childNodes.push(node);
			return node;
		},

		/**
		 * Outputs the node as a serialised XML string.
		 * @returns {string}
		 */
		toString: function () {
			function escape(str) {
				return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
			}

			function attributes(attrs) {
				var nodes = [];

				for (var key in attrs) {
					if (attrs.hasOwnProperty(key) && attrs[key] != null) {
						nodes.push(key + '="' + escape(attrs[key]) + '"');
					}
				}

				return nodes.length ? ' ' + nodes.join(' ') : '';
			}

			function childNodes(nodeList) {
				var nodes = [];
				for (var i = 0, j = nodeList.length; i < j; ++i) {
					nodes.push(typeof nodeList[i] === 'string' ? escape(nodeList[i]) : nodeList[i].toString());
				}

				return nodes.join('');
			}

			var children = childNodes(this.childNodes);

			return '<' + this.nodeName + attributes(this.attributes) + (children.length ? '>' + children + '</' + this.nodeName + '>' : '/>');
		}
	};

	return {
		XmlNode: XmlNode
	};
});